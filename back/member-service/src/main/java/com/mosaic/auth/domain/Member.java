package com.mosaic.auth.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "member")
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "oauth_id", unique = true, nullable = false)
    private Long oauthId;

    @Column(name = "name")
    private String name;

    @Column(name = "oauth_provider")
    private String oauthProvider = "KAKAO";

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public void setOauthId(Long oauthId) {
        this.oauthId = oauthId;
    }

    public void setName(String name) {
        this.name = name;
    }
}
