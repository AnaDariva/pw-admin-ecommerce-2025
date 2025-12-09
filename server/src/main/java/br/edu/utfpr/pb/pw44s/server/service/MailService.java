package br.edu.utfpr.pb.pw44s.server.service;

import br.edu.utfpr.pb.pw44s.server.model.Order;
import br.edu.utfpr.pb.pw44s.server.model.OrderStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from:no-reply@nbastore.com}")
    private String from;

    public MailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOrderStatusChangedEmail(Order order,
                                            OrderStatus oldStatus,
                                            OrderStatus newStatus) {


        if (order == null || order.getUser() == null || order.getUser().getUsername() == null) {
            Long id = order != null ? order.getId() : null;
            System.err.printf(
                    ">>> Pedido #%s sem usuário/e-mail associado. E-mail de status não será enviado.%n",
                    id != null ? id : "desconhecido"
            );
            return;
        }

        String to = order.getUser().getUsername();

        String subject = "Atualização do pedido #" + order.getId();
        String text = """
                Olá, %s!

                O status do seu pedido #%d foi atualizado.

                Status anterior: %s
                Novo status: %s

                Obrigado por comprar na NBA Store!
                """
                .formatted(
                        order.getUser().getDisplayName(),
                        order.getId(),
                        oldStatus,
                        newStatus
                );

        System.out.printf(
                ">>> Enviando e-mail para %s sobre pedido #%d (%s -> %s)%n",
                to, order.getId(), oldStatus, newStatus
        );

        mailSender.send(message(subject, text, to));

        System.out.printf(
                ">>> E-mail enviado para %s sobre pedido #%d (%s -> %s)%n",
                to, order.getId(), oldStatus, newStatus
        );
    }

    private SimpleMailMessage message(String subject, String text, String to) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(from);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        return message;
    }
}
