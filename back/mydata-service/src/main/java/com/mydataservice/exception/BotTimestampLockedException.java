package com.mydataservice.exception;

public class BotTimestampLockedException extends RuntimeException {
	public BotTimestampLockedException(String message) {
		super(message);
	}
}
