package com.mosaic.core.util;

import org.springframework.http.HttpMethod;

import lombok.Getter;

@Getter
public enum InternalApiTarget {

	MEMBER("http://member-api:8080", MemberUri.class),
	ACCOUNT("http://account-api:8080", AccountUri.class),
	CONTRACT("http://contract-api:8080", ContractUri.class),
	CREDIT("http://credit-api:8080", CreditUri.class),
	MYDATA("http://mydata-api:8080", MyDataUri.class);

	private final String baseUrl;
	private final Class<? extends InternalApiUri> uriEnum;

	InternalApiTarget(String baseUrl, Class<? extends InternalApiUri> uriEnum) {
		this.baseUrl = baseUrl;
		this.uriEnum = uriEnum;
	}

	public interface InternalApiUri {
		String getPath();
	}

	public enum MemberUri implements InternalApiUri {
		BASE("/members", HttpMethod.GET),
		DETAIL("/members/{id}", HttpMethod.GET);

		private final String path;
		private final HttpMethod method;
		MemberUri(String path, HttpMethod method) {
			this.path = path;
			this.method = method;
		}

		@Override
		public String getPath() {
			return path;
		}
	}

	public enum AccountUri implements InternalApiUri {
		BASE("/accounts", HttpMethod.GET),
		GET_ACCOUNT("/accounts/{id}", HttpMethod.GET),
		DO_INVESTMENT("/accounts/{id}/investment", HttpMethod.GET),
		DETAIL("/accounts/{id}", HttpMethod.GET);

		private final String path;
		private final HttpMethod method;

		AccountUri(String path, HttpMethod method) {
			this.path = path;
			this.method = method;
		}

		@Override
		public String getPath() {
			return path;
		}
	}

	public enum ContractUri implements InternalApiUri {
		INVEST("/investments", HttpMethod.GET);

		private final String path;
		private final HttpMethod method;
		ContractUri(String path, HttpMethod method) {
			this.path = path;
			this.method = method;
		}

		@Override
		public String getPath() {
			return path;
		}
	}

	public enum CreditUri implements InternalApiUri {
		BASE("/credits", HttpMethod.GET);

		private final String path;
		private final HttpMethod method;
		CreditUri(String path, HttpMethod method) {
			this.path = path;
			this.method = method;
		}

		@Override
		public String getPath() {
			return path;
		}
	}

	public enum MyDataUri implements InternalApiUri {
		BASE("/mydata", HttpMethod.GET);

		private final String path;
		private final HttpMethod method;
		MyDataUri(String path, HttpMethod method) {
			this.path = path;
			this.method = method;
		}

		@Override
		public String getPath() {
			return path;
		}
	}
}
