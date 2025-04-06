package com.mosaic.accountservice.external.model;

import lombok.Getter;

@Getter
public enum BankCode {
	BANK_OF_KOREA("001", "한국은행"),
	KDB("002", "산업은행"),
	IBK("003", "기업은행"),
	KOOKMIN("004", "국민은행"),
	KEB("005", "외환은행"),
	SUHYUP("007", "수협중앙회"),
	KEXIM("008", "수출입은행"),
	NH("011", "농협은행"),
	LOCAL_NH("012", "지역농.축협"),
	WOORI("020", "우리은행"),
	SC("023", "SC은행"),
	CITI("027", "한국씨티은행"),
	DAEGU("031", "대구은행"),
	BUSAN("032", "부산은행"),
	GWANGJU("034", "광주은행"),
	JEJU("035", "제주은행"),
	JEONBUK("037", "전북은행"),
	GYEONGNAM("039", "경남은행"),
	SAE_MAEUL("045", "새마을금고중앙회"),
	SHINHYEOP("048", "신협중앙회"),
	SAVINGS_BANK("050", "상호저축은행"),
	BANK_OF_CHINA("051", "중국은행"),
	MORGAN_STANLEY("052", "모건스탠리은행"),
	HSBC("054", "HSBC은행"),
	DEUTSCHE("055", "도이치은행"),
	RBS("056", "알비에스피엘씨은행"),
	JPMORGAN("057", "제이피모간체이스은행"),
	MIZUHO("058", "미즈호은행"),
	MUFG("059", "미쓰비시도쿄UFJ은행"),
	BOA("060", "BOA은행"),
	BNP_PARIBAS("061", "비엔피파리바은행"),
	ICBC("062", "중국공상은행"),
	BOC("063", "중국은행"),
	KFS("064", "산림조합중앙회"),
	DAEHWA("065", "대화은행"),
	COMM_BANK("066", "교통은행"),
	POST_OFFICE("071", "우체국"),
	KODIT("076", "신용보증기금"),
	KIBO("077", "기술보증기금"),
	HANA("081", "KEB하나은행"),
	SHINHAN("088", "신한은행"),
	K_BANK("089", "케이뱅크"),
	KAKAO_BANK("090", "카카오뱅크"),
	TOSS_BANK("092", "토스뱅크"),
	HF("093", "한국주택금융공사"),
	SGI("094", "서울보증보험"),
	POLICE("095", "경찰청"),
	KFTC("096", "한국전자금융(주)"),
	KFTC_CLEARING("099", "금융결제원"),

	// 저축은행
	DAE_SHIN_SAVINGS("102", "대신저축은행"),
	SBI_SAVINGS("103", "에스비아이저축은행"),
	HK_SAVINGS("104", "에이치케이저축은행"),
	WELCOME_SAVINGS("105", "웰컴저축은행"),
	SHINHAN_SAVINGS("106", "신한저축은행"),

	// 증권사
	YUANTA("209", "유안타증권"),
	HYUNDAI("218", "현대증권"),
	GOLDEN_BRIDGE("221", "골든브릿지투자증권"),
	HANYANG("222", "한양증권"),
	LEADING("223", "리딩투자증권"),
	BNK_INVEST("224", "BNK투자증권"),
	IBK_INVEST("225", "IBK투자증권"),
	KB_INVEST("226", "KB투자증권"),
	KTB_INVEST("227", "KTB투자증권"),
	MIRAeASSET("230", "미래에셋증권"),
	DAEWOO("238", "대우증권"),
	SAMSUNG("240", "삼성증권"),
	KOREA_INVEST("243", "한국투자증권"),
	KYOBO("261", "교보증권"),
	HI_INVEST("262", "하이투자증권"),
	HMC("263", "HMC투자증권"),
	KIWOOM("264", "키움증권"),
	E_INVEST("265", "이베스트투자증권"),
	SK("266", "SK증권"),
	DAE_SHIN("267", "대신증권"),
	HANHWA("269", "한화투자증권"),
	HANA_DAEWOO("270", "하나대투증권"),
	SHINHAN_INVEST("278", "신한금융투자"),
	DB_INVEST("279", "DB금융투자"),
	EUGENE_INVEST("280", "유진투자증권"),
	MERITZ("287", "메리츠종합금융증권"),
	NH_INVEST("289", "NH투자증권"),
	BUKOOK("290", "부국증권"),
	SHINYOUNG("291", "신영증권"),
	LIG("292", "엘아이지투자증권"),
	KOREA_SECURITIES_FINANCE("293", "한국증권금융"),
	FUND_ONLINE_KOREA("294", "펀드온라인코리아"),
	WOORI_INVEST("295", "우리종합금융"),
	SAMSUNG_FUTURES("296", "삼성선물"),
	KEB_FUTURES("297", "외환선물"),
	HYUNDAI_FUTURES("298", "현대선물");

	private final String code;
	private final String name;

	BankCode(String code, String name) {
		this.code = code;
		this.name = name;
	}

	public static BankCode fromCode(String code) {
		for (BankCode bankCode : values()) {
			if (bankCode.getCode().equals(code)) {
				return bankCode;
			}
		}
		throw new IllegalArgumentException("Invalid bank code: " + code);
	}
}
