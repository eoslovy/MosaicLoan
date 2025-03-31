package com.contractservice.health;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Ping {

    @Id
    private Long id;

    public Ping() {}

    public Ping(Long id) {
        this.id = id;
    }

    // getter/setter 생략 가능 합니다 초ㄴㅇs
}