package com.email.writer;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/email")
@AllArgsConstructor
@CrossOrigin(origins = {
        "https://mail.google.com",
        "http://localhost:5173"
})
public class EmailGeneratorController {

    private final EmailGeneratorService emailGeneratorService;

    @PostMapping("/generate")
    public ResponseEntity<EmailResponse> generateEmail(
            @RequestBody EmailRequest emailRequest) {

        EmailResponse response =
                emailGeneratorService.generateEmailReply(emailRequest);

        return ResponseEntity.ok(response);
    }
}