package com.email.writer;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

@Service
public class EmailGeneratorService {

    private final WebClient webClient;
    private final String apiKey;

    public EmailGeneratorService(
            @Value("${gemini.api.url}") String baseUrl,
            @Value("${gemini.api.key}") String geminiApiKey) {

        this.apiKey = geminiApiKey;

        this.webClient = WebClient.builder()
                .baseUrl(baseUrl)
                .build();
    }

    public EmailResponse generateEmailReply(EmailRequest emailRequest) {

        String prompt = buildPrompt(emailRequest);

        String requestBody = String.format("""
                {
                  "contents": [
                    {
                      "parts": [
                        {
                          "text": "%s"
                        }
                      ]
                    }
                  ]
                }
                """, escapeJson(prompt));

        String response = webClient.post()
                .uri(uriBuilder -> uriBuilder
                        .path("/v1beta/models/gemini-3.5-flash:generateContent")
                        .build())
                .header("x-goog-api-key", apiKey)
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        return extractResponseContent(response);
    }

    private EmailResponse extractResponseContent(String response) {

        try {

            ObjectMapper mapper = new ObjectMapper();

            JsonNode root = mapper.readTree(response);

            String generatedText = root
                    .path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();

            // Remove markdown code fences if Gemini adds them
            generatedText = generatedText
                    .replace("```json", "")
                    .replace("```", "")
                    .trim();

            JsonNode result = mapper.readTree(generatedText);

            String reply = result
                    .path("reply")
                    .asText();

            String summary = result
                    .path("summary")
                    .asText();

            String intent = result
                    .path("intent")
                    .asText();

            String priority = result
                    .path("priority")
                    .asText();

            return new EmailResponse(
                    reply,
                    summary,
                    intent,
                    priority
            );

        } catch (Exception e) {

            throw new RuntimeException(
                    "Error parsing Gemini response: " + response,
                    e
            );
        }
    }

    private String buildPrompt(EmailRequest emailRequest) {

        StringBuilder prompt = new StringBuilder();

        prompt.append("""
                You are an AI Email Intelligence Assistant.

                Analyze the given email and generate a useful response.

                Return ONLY valid JSON.
                Do not use markdown.
                Do not add explanations outside the JSON.

                The JSON must follow exactly this structure:

                {
                  "reply": "The generated email reply",
                  "summary": "A short summary of the original email",
                  "intent": "The main purpose of the email",
                  "priority": "High, Medium, or Low"
                }

                Requirements:

                1. reply:
                   Generate a context-aware email response.

                2. summary:
                   Summarize the original email in 1-2 sentences.

                3. intent:
                   Identify the main purpose of the email.
                   Examples:
                   - Meeting Request
                   - Meeting Confirmation
                   - Information Request
                   - Task Assignment
                   - Follow-up
                   - Complaint
                   - Job Opportunity
                   - Project Update
                   - General Communication

                4. priority:
                   Determine whether the email is High, Medium, or Low priority.

                """);

        if (emailRequest.getTone() != null &&
                !emailRequest.getTone().isEmpty()) {

            prompt.append("Use a ")
                    .append(emailRequest.getTone())
                    .append(" tone for the generated reply.\n");
        }

        prompt.append("\nOriginal Email:\n")
                .append(emailRequest.getEmailContent());

        return prompt.toString();
    }

    private String escapeJson(String text) {

        return text
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }
}