package com.mosaic.core.util;

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
		BASE("/api/members"),
		DETAIL("/api/members/{id}");

		private final String path;

		MemberUri(String path) {
			this.path = path;
		}

		@Override
		public String getPath() {
			return path;
		}
	}

	public enum AccountUri implements InternalApiUri {
		BASE("/api/accounts"),
		GET_ACCOUNT("/api/accounts/{id}"),
		DETAIL("/api/accounts/{id}");

		private final String path;

		AccountUri(String path) {
			this.path = path;
		}

		@Override
		public String getPath() {
			return path;
		}
	}

	public enum ContractUri implements InternalApiUri {
		INVEST("/api/investments");

		private final String path;

		ContractUri(String path) {
			this.path = path;
		}

		@Override
		public String getPath() {
			return path;
		}
	}

	public enum CreditUri implements InternalApiUri {
		BASE("/api/credits");

		private final String path;

		CreditUri(String path) {
			this.path = path;
		}

		@Override
		public String getPath() {
			return path;
		}
	}

	public enum MyDataUri implements InternalApiUri {
		BASE("/api/mydata");

		private final String path;

		MyDataUri(String path) {
			this.path = path;
		}

		@Override
		public String getPath() {
			return path;
		}
	}
}
