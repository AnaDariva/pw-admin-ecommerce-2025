package br.edu.utfpr.pb.pw44s.server.controller;

import br.edu.utfpr.pb.pw44s.server.dto.OrderDocumentDTO;
import br.edu.utfpr.pb.pw44s.server.model.OrderDocument;
import br.edu.utfpr.pb.pw44s.server.service.OrderDocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/admin/orders")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminOrderDocumentController {

    private final OrderDocumentService documentService;

    @PostMapping("/{orderId}/documents")
    public OrderDocumentDTO uploadDocument(@PathVariable Long orderId,
                                           @RequestParam("file") MultipartFile file) throws IOException {
        return documentService.upload(orderId, file);
    }

    @GetMapping("/{orderId}/documents")
    public List<OrderDocumentDTO> listDocuments(@PathVariable Long orderId) {
        return documentService.listByOrder(orderId);
    }

    @GetMapping("/documents/{documentId}/download")
    public ResponseEntity<Resource> downloadDocument(@PathVariable Long documentId) {
        OrderDocument doc = documentService.getDocument(documentId);
        Resource resource = documentService.loadFile(doc);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(doc.getContentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + doc.getOriginalFilename() + "\"")
                .body(resource);
    }

    @GetMapping("/documents/{documentId}/view")
    public ResponseEntity<Resource> viewDocument(@PathVariable Long documentId) {
        OrderDocument doc = documentService.getDocument(documentId);
        Resource resource = documentService.loadFile(doc);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(doc.getContentType()))
                .body(resource);
    }
}
