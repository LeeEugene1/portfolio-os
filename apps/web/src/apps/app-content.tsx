"use client";

import Image from "next/image";
import { type MouseEvent, useEffect, useState } from "react";
import { CalculatorApp } from "./calculator/calculator-app";

export { StoreApp } from "./store-app";

type PortfolioItem =
  | string
  | {
      href: string;
      label: string;
      text: string;
    };

type PortfolioSection = {
  title: string;
  items: PortfolioItem[];
};

type PortfolioPart = {
  id: string;
  label: string;
  name: string;
  tagline: string;
  meta?: string;
  link?: {
    href: string;
    label: string;
  };
  metrics?: string[];
  sections: PortfolioSection[];
};

type ResumeHighlight =
  | string
  | {
      title: string;
      details: string[];
    };

type ResumeRole = {
  title: string;
  description?: string;
  highlights: ResumeHighlight[];
  stack: string;
};

type ResumeExperience = {
  company: string;
  period: string;
  roles: ResumeRole[];
};

const resumePdfPath = "/resume-eugene-lee-frontend.pdf";
const portfolioPdfPath = "/portfolio-eugene-lee-frontend.pdf";

const portfolioParts: PortfolioPart[] = [
  {
    id: "whoami",
    label: "whoami",
    name: "이유진",
    tagline: "Frontend Engineer",
    metrics: [
      "장바구니 가격 반영 시간 1.5초 → 0.6초 개선",
      "iOS WKWebView 로그인 직후 401 오류 88% 감소",
      "웹/모바일 52개 페이지 이벤트 추적 구조 표준화",
      "AI 기반 자동화로 배포 후 릴리즈 노트 정리 시간 10분 → 1분 단축",
    ],
    sections: [
      {
        title: "Intro",
        items: [
          "사용자가 구매 흐름에서 느끼는 작은 마찰을 발견하고, 성능, 인증, 데이터 수집 구조를 수치 기반으로 개선하는 프론트엔드 개발자 이유진입니다.",
          "디자인과 구현 사이의 디테일을 중요하게 보며, 몇 ms의 입력 지연, 로그인 직후의 인증 유실, 클릭 이벤트 누락처럼 전환을 방해하는 문제를 끝까지 추적해 개선합니다.",
        ],
      },
    ],
  },
  {
    id: "thirtymall",
    label: "thirtymall",
    name: "Thirtymall",
    tagline: "구매 전환 플로우 성능 및 안정성 개선",
    meta: "Next.js, React, TypeScript, Redux Toolkit, Material UI",
    link: { href: "https://thirtymall.com", label: "thirtymall.com" },
    sections: [
      {
        title: "Overview",
        items: [
          "떠리몰 모바일 웹과 웹 서비스에서 상품 탐색, 로그인, 장바구니 등 구매 전환에 직접 연결되는 사용자 흐름을 개선했습니다.",
          "외주 개발 이관 이후 복잡하게 분산되어 있던 이커머스 비즈니스 로직을 안정화하고, 사용자가 실제로 체감하는 지연과 실패 지점을 수치 기반으로 줄이는 데 집중했습니다.",
        ],
      },
      {
        title: "1-1. 장바구니 수량 변경 UX 개선",
        items: [
          "Problem: 장바구니에서 수량을 변경하면 가격이 반영되기까지 약 1.5초가 걸렸습니다. 수량을 여러 번 조정할 때 변경 결과가 늦게 보여 사용자가 기다려야 했고, 구매 흐름이 끊기는 문제가 있었습니다.",
          "Cause: 수량 변경 이후 장바구니 전체 데이터와 선택 항목 기준 가격 집계 데이터를 갱신하는 과정이 반복적으로 발생했습니다. 기존에는 회원/비회원, 모바일/웹 로직이 화면별로 흩어져 있어 같은 문제를 수정할 때 여러 구현을 함께 확인해야 했습니다.",
          "Solution: 전체 장바구니 데이터와 선택 항목 기준 집계 가격 조회를 Promise.all로 병렬 처리하고, 수량 변경 핸들러를 공통 useCartQty 훅으로 분리하고 debounce를 적용해 연속 클릭 시 API 호출량을 제어했습니다.",
          "Result: 가격 반영 시간 1.5초 → 0.6초 개선, 응답 시간 약 60% 단축, 중복 로직을 줄여 장바구니 유지보수성 개선.",
          "Learned: 장바구니 수량 변경 debounce를 1000ms → 250ms로 줄이며, 구매 전환 구간에서는 API 요청 수뿐 아니라 사용자가 가격 변화를 즉시 확인할 수 있는지도 함께 봐야 한다는 기준을 갖게 되었습니다.",
        ],
      },
      {
        title: "1-2. iOS WebView 로그인 401 오류 개선",
        items: [
          "Problem: iOS WebView 환경에서 카카오 로그인 직후 401 오류가 반복적으로 발생했습니다. 사용자는 로그인에 성공한 것처럼 보였지만, 곧바로 인증이 풀리거나 강제 로그아웃되는 경험을 했습니다.",
          "Investigation: OAuth 스펙 기준으로 서비스 ↔ 샵바이 SaaS ↔ 카카오 로그인 프로바이더 인증 흐름을 정리하고, OAuth Callback, accessToken 발급, /profile 인증 요청 구간의 로그를 단계별로 분리했습니다.",
          "Investigation: Safari Web Inspector로 iOS WKWebView의 쿠키 및 인증 헤더 상태를 확인했고, 로그인 성공 직후 accessToken 발급은 성공하지만 일부 iOS WebView에서 /profile 요청 시 인증 쿠키가 누락되는 패턴을 확인했습니다.",
          "Solution: OAuth Callback 응답 직후 클라이언트에서도 accessToken 쿠키를 명시적으로 설정해 서버 응답 쿠키와 클라이언트 쿠키 상태를 동기화하였습니다.",
          "Result: 로그인 직후 5분 내 401 인증 오류 88% 감소(170건 → 20건), iOS WKWebView 환경의 로그인 유지 안정성 개선.",
          "Learned: OAuth Callback 성공 직후 인증 요청에서 accessToken이 누락되는 문제를 추적하며, iOS WKWebView에서는 쿠키 저장소 반영 시점에 따라 브라우저와 다른 인증 실패가 발생할 수 있음을 확인했습니다.",
        ],
      },
      {
        title: "2. 전시/추천 영역 이벤트 트래킹 표준화",
        items: [
          "마케팅 신규 페이지와 추천 섹션의 성과를 일관되게 측정할 수 있도록 GTM → MMP 솔루션 기반 이벤트 추적 구조를 표준화했습니다.",
          "전시 영역 트래킹 스펙을 문서화하고, 산발적으로 호출되던 마케팅 SDK 연동 코드를 공통 인터페이스 기반으로 분리했습니다.",
          "page → section → item 기반 이벤트 위계 정의 및 문서화, data-component, data-id, data-idx, data-label 등 공통 데이터 스키마 정의.",
          "웹/모바일에서 같은 규칙으로 태그를 적용할 수 있는 DataTagWrapper 컴포넌트 구축.",
          "Result: 웹/모바일 52개 페이지의 전시 트래킹 구조 표준화, 기획/마케팅팀이 page > section > item 단위로 성과를 비교할 수 있는 기준 마련.",
        ],
      },
      {
        title: "3. 개발 운영 자동화 및 AI 워크플로우 구축",
        items: [
          "프론트엔드 개발과 운영 과정에서 반복되는 계획 수립, PR 리뷰, 배포 검수, 릴리즈 정리, 문서화를 Claude Code Skill 기반 워크플로우로 자동화했습니다.",
          "릴리즈 정리 시간 10분 → 1분 단축, 프론트엔드 팀원 3명 사용 확산, 멀티 AI 리뷰 10개 PR 적용, RCA/스펙/개발 계획서 등 60개 위키 문서 작성.",
          "PR diff를 Codex, Claude, Gemini CLI에 병렬 요청하고 각 도구의 리뷰 결과를 통합해 중복 의견과 유효한 지적을 분리했습니다.",
          "Node.js 기반 오케스트레이터로 PLAN → GENERATE → CHECK 단계를 분리하고, plans/{ticketId}.state.json으로 단계별 실행 상태를 저장해 중단 후 이어서 실행 가능하도록 설계했습니다.",
        ],
      },
    ],
  },
  {
    id: "caveduck",
    label: "caveduck",
    name: "Caveduck",
    tagline: "AI Character Chat Platform",
    meta: "Angular, Node.js, Tailwind CSS, Retool, Lambda, EC2",
    link: { href: "https://caveduck.io/?locale=en", label: "caveduck.io" },
    sections: [
      {
        title: "Performance & SEO",
        items: [
          "SEO Lighthouse 100 달성, CLS 0.6에서 0.1로 개선",
          "S3 webp와 Cloudflare 캐시 기반 이미지 최적화",
          "Skeleton loader 도입으로 레이아웃 이동을 줄이고 체감 품질 개선",
        ],
      },
      {
        title: "Automation",
        items: [
          "NSFW 캐릭터 신고 카운트 기반 Public 노출 자동 제외",
          "Retool과 Slack 알림으로 관리자 신고 대응 자동화",
        ],
      },
    ],
  },
  {
    id: "sheepfarm",
    label: "sheepfarm",
    name: "Sheepfarm",
    tagline: "Blockchain P2E Game",
    meta: "React, TypeScript, JavaScript, SCSS, Node.js, Vite, EC2",
    sections: [
      {
        title: "Web3 Flow",
        items: [
          "지갑 인증, NFT 민팅, FT 구매 등 Web3 사용자 거래 플로우 구현",
          "블록체인 네트워크별 지갑 연결, RPC, 컨트랙트 주소 설정을 공통화해 Oasys Homeverse, Kroma, Skale 등 신규 네트워크 추가 시 수정 범위 최소화",
        ],
      },
      {
        title: "Operation",
        items: [
          "관리자 시스템 React 마이그레이션으로 컴포넌트 구조 통일 및 유지보수 효율 개선",
          "AWS EC2 테스트 서버 구축으로 배포 검증 환경 분리 및 안정성 확보",
        ],
      },
    ],
  },
  {
    id: "etc",
    label: "etc",
    name: "Etc",
    tagline: "휴네이처 · 유클리드소프트",
    meta: "Python, Flask, HTML, CSS, SCSS, JavaScript, AdobeXD",
    sections: [
      {
        title: "휴네이처",
        items: [
          "공군 전파탐지기 소프트웨어 웹 개발",
          "Web Components 기반 공통 UI 컴포넌트 구축",
          "Flask 기반 비대면 체크인을 위한 QR 이미지 생성, 다운로드 API 개발",
        ],
      },
      {
        title: "유클리드소프트",
        items: [
          "의약품 QR 스캔 앱, AI 신약개발 플랫폼, 화학 분석 모듈, 주파수 정보 앱 등 4개 프로젝트의 UI/UX 및 반응형 웹·앱 화면을 설계",
          {
            text: "포트폴리오",
            href: "https://leeeugene1.github.io/UX_Portfolio/",
            label: "UX_Portfolio 바로가기",
          },
        ],
      },
    ],
  },
];

const resumeExperience: ResumeExperience[] = [
  {
    company: "핌아시아",
    period: "2024.04 ~ 2026.05 (2년 1개월)",
    roles: [
      {
        title: "이커머스 모바일 웹 프론트엔드 개발 (떠리몰)",
        highlights: [
          "MAU 240만 규모 떠리몰 모바일 웹(Flutter WebView) 신규 개발 및 유지보수 담당",
          "샵바이 API 기반 커머스 SaaS와 연동해 상품 탐색, 장바구니, OAuth 로그인/회원가입, 개인화 추천 등 핵심 구매 전환 플로우 개발",
          "외주 개발 이관 이후 복잡한 이커머스 비즈니스 로직 안정화 및 주요 사용자 이슈 개선",
          {
            title: "iOS 로그인 직후 5분 내 401 인증 오류 88% 감소(170건 → 20건)",
            details: [
              "iOS WKWebView 쿠키 반영 지연으로 로그인 직후 인증 정보가 누락되는 문제를 분석하고, Callback 응답의 accessToken 을 클라이언트 쿠키에 명시적으로 동기화",
            ],
          },
          {
            title: "장바구니 가격 반영 시간 60% 단축(1.5초 → 0.6초)",
            details: [
              "수량 변경 debounce 조정, 전체 장바구니/선택 항목 가격 조회 병렬 처리",
              "유지보수 효율을 위해 PC/Mobile, 회원/비회원에 흩어져 있던 장바구니 로직을 모노레포 공통 패키지(@repo/common)로 통합해 전체 코드량 2.2% 감소",
            ],
          },
          {
            title: "상품 탐색 UX 개선",
            details: [
              "useInView 기반 섹션 지연 로딩, Redux/메모리 캐싱, Virtuoso 가상 리스트, 스크롤 복원, 이미지 로딩 최적화 적용",
            ],
          },
          {
            title: "추천 영역 월 평균 클릭 100만 달성",
            details: [
              "최근 본 상품 기반 개인화 추천 섹션을 구축하고 비회원 fallback, 추천 셔플, 탭형 슬라이더를 적용해 탐색 UX 개선",
            ],
          },
          {
            title: "52개 페이지 마케팅 이벤트 추적 표준화",
            details: [
              "page → section → item 단위의 이벤트 텍소노미와 공통 DataTagWrapper를 설계해 전시 영역별 클릭/노출 추적 규격 통일",
              "Airbridge 이벤트명/payload 변환 로직을 공통 provider로 분리해 마케팅 SDK 의존성 격리",
            ],
          },
          {
            title: "AI 기반 개발 과정 자동화",
            details: [
              "Claude Code 기반 Plan–Generate–Check 자동화 오케스트레이터 설계",
              "PR diff를 Codex / Claude / Gemini CLI에 병렬 검토시키는 멀티 AI 리뷰 워크플로우 구성 및 팀 내 공유",
            ],
          },
          {
            title: "AI 기반 개발 운영 자동화 및 문서화 워크플로우 구축",
            details: [
              "Jira 진행 중 티켓 기반 데일리 TODO Google Chat 알림 봇 구축 및 팀 공유",
              "주간 웹 퍼포먼스 측정 및 Playwright 스크린샷 자동화",
              "격주 배포후 릴리즈 노트 정리 시간 10분 → 1분 단축, 장애/이슈 원인 분석(RCA), 스펙, 계획서 60개 위키 문서 자동화",
            ],
          },
        ],
        stack: "Next.js, React, TypeScript, Redux Toolkit, Material UI",
      },
      {
        title: "백오피스 프론트 개발",
        highlights: [
          "이커머스 운영 어드민의 주문, 상품, 마케팅, CS, 통계 관리 화면 신규 개발",
          "SCSS 공통 스타일과 공통 컴포넌트로 백오피스 UI 일관성과 개발 재사용성 확보",
          {
            title: "AG Grid 공통 모듈화 및 엑셀 다운로드 컴포넌트 구축",
            details: [
              "테이블 반복 구현 비용을 줄이고 컬럼 선택/제외 등 화면별 확장성 확보",
            ],
          },
          {
            title: "거래처 관리 칸반보드 신규 개발",
            details: [
              "Figma AI 생성 화면을 기존 백오피스의 SCSS 공통 스타일, 공통 컴포넌트, 상태관리 패턴에 맞게 전환하도록 프롬프트 하네스를 설계해 구현 일관성 확보",
            ],
          },
          {
            title: "Docker 기반 빌드/배포 환경 정비",
            details: [
              "Node 22 기반 Dockerfile을 직접 작성해 환경별 빌드, 실행 절차를 구성하고, Node / 환경변수 / ESLint / Prettier 설정 가이드를 문서화",
            ],
          },
        ],
        stack: "React, Tanstack Query, Zustand, AG Grid, SCSS, Docker",
      },
    ],
  },
  {
    company: "나이팅게일 코리아",
    period: "2022.06 ~ 2024.04 (1년 8개월)",
    roles: [
      {
        title: "AI 캐릭터 채팅 플랫폼 프론트엔드 개발 (Caveduck)",
        highlights: [
          "이미지 최적화와 Skeleton Loader 도입으로 Lighthouse 100점 달성, CLS 0.6에서 0.1로 개선, 초기 로딩 시간 1초 단축",
          "AWS Lambda 기반 주간 크리에이터 랭킹 시스템 구축으로 캐릭터 등록률 10% 상승",
          "Retool과 Slack 알림을 활용한 신고 캐릭터 자동 비노출 시스템 구축",
          "TTS 음성 파일 캐싱 및 재생 로직을 개선해 반복 재생 시 로딩 지연 완화 및 중복 호출 비용 절감",
        ],
        stack: "Angular, Node.js, Tailwind CSS, Retool, Lambda, EC2",
      },
      {
        title: "블록체인 게임 웹사이트 프론트엔드 개발 (Sheepfarm in metaland)",
        highlights: [
          "지갑 인증, NFT 민팅, FT 구매 등 Web3 사용자 거래 플로우 구현",
          "블록체인 네트워크별 지갑 연결, RPC, 컨트랙트 주소 설정을 공통화해 Oasys Homeverse, Kroma, Skale 등 신규 네트워크 추가 시 수정 범위 최소화",
          "관리자 시스템 React 마이그레이션으로 컴포넌트 구조 통일 및 유지보수 효율 개선",
          "AWS EC2 테스트 서버 구축으로 배포 검증 환경 분리 및 안정성 확보",
        ],
        stack: "React, TypeScript, JavaScript, SCSS, Node.js, Vite, EC2",
      },
    ],
  },
  {
    company: "휴네이처",
    period: "2021.03 ~ 2022.03 (1년) - (주)휴네이처, 서울 중구",
    roles: [
      {
        title: "공군 전파탐지기 소프트웨어 웹 개발",
        highlights: [
          "Web Components 기반 공통 UI 컴포넌트 구축",
          "Flask 기반 비대면 체크인을 위한 QR 이미지 생성, 다운로드 API 개발",
        ],
        stack: "Python, Flask, HTML, JavaScript, CSS",
      },
    ],
  },
  {
    company: "유클리드소프트",
    period: "2020.06 ~ 2020.10 (4개월)",
    roles: [
      {
        title: "반응형 UI/UX 설계 및 프론트엔드 개발",
        highlights: [
          "의약품 QR 스캔 앱, AI 신약개발 플랫폼, 화학 분석 모듈, 주파수 정보 앱 등 4개 프로젝트의 UI/UX 및 반응형 웹·앱 화면을 설계",
          "포트폴리오: https://leeeugene1.github.io/UX_Portfolio/",
        ],
        stack: "HTML, CSS, SCSS, JavaScript, AdobeXD",
      },
    ],
  },
];

const resumeEducation = [
  {
    name: "패스트캠퍼스 INNER CIRCLE",
    period: "2025.03 ~ 2025.06",
    detail: "웹 애플리케이션 실무 과정 수료",
  },
  {
    name: "대덕인재개발원",
    period: "2019.10 ~ 2020.06",
    detail: "Java기반의 응용 소프트웨어엔지니어링 실무과정 수료",
  },
  {
    name: "건양대학교 패션디자인산업학과",
    period: "2011.03 ~ 2015.02",
    detail: "졸업",
  },
];
export function PortfolioApp() {
  const [activePartId, setActivePartId] = useState(portfolioParts[0].id);

  useEffect(() => {
    const container = document
      .querySelector(".terminal-portfolio")
      ?.closest(".window-body");

    if (!(container instanceof HTMLElement)) {
      return;
    }

    const scrollRoot = container;

    function updateActivePart() {
      const activationTop = scrollRoot.getBoundingClientRect().top + 80;
      const activePart = portfolioParts.reduce<PortfolioPart | null>((current, part) => {
        const section = document.getElementById(`portfolio-${part.id}`);

        if (!section) {
          return current;
        }

        return section.getBoundingClientRect().top <= activationTop ? part : current;
      }, portfolioParts[0]);

      setActivePartId(activePart?.id ?? portfolioParts[0].id);
    }

    scrollRoot.addEventListener("scroll", updateActivePart, { passive: true });
    updateActivePart();

    return () => scrollRoot.removeEventListener("scroll", updateActivePart);
  }, []);

  function handlePortfolioNavClick(event: MouseEvent<HTMLAnchorElement>, partId: string) {
    event.preventDefault();
    const target = document.getElementById(`portfolio-${partId}`);
    const scrollRoot = target?.closest(".window-body");

    setActivePartId(partId);

    if (target && scrollRoot instanceof HTMLElement) {
      const nav = scrollRoot.querySelector(".terminal-tabs");
      const navHeight = nav instanceof HTMLElement ? nav.offsetHeight : 0;
      const nextScrollTop =
        scrollRoot.scrollTop +
        target.getBoundingClientRect().top -
        scrollRoot.getBoundingClientRect().top -
        navHeight;

      scrollRoot.scrollTo({ top: nextScrollTop, behavior: "auto" });
    }

    window.history.pushState(null, "", `#portfolio-${partId}`);
  }

  return (
    <div className="terminal-portfolio" aria-label="Terminal portfolio">
      <nav className="terminal-tabs" aria-label="Portfolio parts">
        <div className="terminal-tab-list">
          {portfolioParts.map((part, index) => (
            <a
              aria-current={part.id === activePartId ? "true" : undefined}
              className="terminal-tab"
              href={`#portfolio-${part.id}`}
              key={part.id}
              onClick={(event) => handlePortfolioNavClick(event, part.id)}
            >
              <span>{index + 1}</span>
              {part.label}
            </a>
          ))}
        </div>
        <a
          className="terminal-pdf-link"
          download="포트폴리오_이유진_프론트엔드개발자.pdf"
          href={portfolioPdfPath}
        >
          PDF
        </a>
      </nav>

      <div className="terminal-panels">
        {portfolioParts.map((part) => (
          <article className="terminal-panel" id={`portfolio-${part.id}`} key={part.id}>
            <div className="terminal-title-row">
              <div>
                <p className="terminal-kicker">{part.label}</p>
                <h2>
                  {part.name}
                  {part.id === "whoami" ? (
                    <span className="terminal-cursor" aria-hidden="true" />
                  ) : null}
                </h2>
                <p>{part.tagline}</p>
                {part.meta ? <p className="terminal-meta">{part.meta}</p> : null}
              </div>
              {part.link ? (
                <a
                  className="terminal-link"
                  href={part.link.href}
                  rel="noreferrer"
                  target="_blank"
                >
                  {part.link.label}
                </a>
              ) : null}
            </div>

            {part.metrics ? (
              <ul className="terminal-metrics" aria-label={`${part.name} metrics`}>
                {part.metrics.map((metric) => (
                  <li key={metric}>{metric}</li>
                ))}
              </ul>
            ) : null}

            <div className="terminal-sections">
              {part.sections.map((section) => (
                <section className="terminal-section" key={section.title}>
                  <h3>{section.title}</h3>
                  <ul>
                    {section.items.map((item) => {
                      if (typeof item === "string") {
                        return <li key={item}>{item}</li>;
                      }

                      return (
                        <li key={item.href}>
                          {item.text}:{" "}
                          <a href={item.href} rel="noreferrer" target="_blank">
                            {item.label}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function ResumeApp() {
  return (
    <article className="resume-document" aria-label="Resume document">
      <header className="resume-document-header">
        <div className="resume-profile">
          <Image
            alt="이유진 증명사진"
            className="resume-photo"
            height={120}
            src="/profile.png"
            width={120}
          />
          <div>
            <p className="eyebrow">Resume</p>
            <h2>이유진</h2>
            <p>5년 차 프론트엔드 개발자 · Next.js / React · 커머스 / AI / WebView</p>
          </div>
        </div>
        <div className="resume-actions">
          <a
            className="app-link"
            download="이력서_이유진_프론트엔드개발자.pdf"
            href={resumePdfPath}
          >
            PDF
          </a>
        </div>
      </header>

      <section className="resume-contact" aria-label="Resume contact">
        <a href="mailto:uwm1004@gmail.com">uwm1004@gmail.com</a>
        <a href="https://github.com/LeeEugene1" rel="noreferrer" target="_blank">
          Github
        </a>
        <a href="https://dubaiyu.tistory.com/" rel="noreferrer" target="_blank">
          Blog
        </a>
      </section>

      <section className="resume-section">
        <h3>Summary</h3>
        <p>
          로그인 오류 88% 개선, 월 100만+ 클릭 개인화 섹션 구축, Lighthouse 성능 100점 달성
          경험을 가진 5년 차 프론트엔드 개발자 이유진입니다. Next.js 기반 커머스 서비스에서
          인증, 상품 탐색, 장바구니, 추천, 백오피스 운영 화면을 개발했으며, 성능, 안정성, 운영
          효율 개선과 AI 기반 개발 자동화를 통해 반복 문제를 구조적으로 해결해 왔습니다.
        </p>
      </section>

      <section className="resume-section">
        <h3>Work experience</h3>
        <div className="resume-timeline">
          {resumeExperience.map((experience) => (
            <section className="resume-company" key={experience.company}>
              <header>
                <h4>{experience.company}</h4>
                <p>{experience.period}</p>
              </header>
              {experience.roles.map((role) => (
                <div className="resume-role" key={role.title}>
                  <h5>{role.title}</h5>
                  {role.description ? <p>{role.description}</p> : null}
                  <ul>
                    {role.highlights.map((item) => {
                      if (typeof item === "string") {
                        return <li key={item}>{item}</li>;
                      }

                      return (
                        <li className="resume-highlight-group" key={item.title}>
                          <strong>{item.title}</strong>
                          <ul>
                            {item.details.map((detail) => (
                              <li key={detail}>{detail}</li>
                            ))}
                          </ul>
                        </li>
                      );
                    })}
                  </ul>
                  <p className="resume-stack">{role.stack}</p>
                </div>
              ))}
            </section>
          ))}
        </div>
      </section>

      <section className="resume-section">
        <h3>Education</h3>
        <div className="resume-education-list">
          {resumeEducation.map((education) => (
            <section key={education.name}>
              <h4>{education.name}</h4>
              <p>
                {education.period} · {education.detail}
              </p>
            </section>
          ))}
        </div>
      </section>
    </article>
  );
}

export function ContactApp() {
  const contactLinks = [
    {
      href: "mailto:uwm1004@gmail.com",
      label: "Email",
      value: "uwm1004@gmail.com",
    },
    {
      href: "https://github.com/LeeEugene1",
      label: "GitHub",
      value: "github.com/LeeEugene1",
    },
    {
      href: "https://dubaiyu.tistory.com/",
      label: "Blog",
      value: "dubaiyu.tistory.com",
    },
  ];

  return (
    <div className="app-content contact-app">
      <p className="eyebrow contact-eyebrow">Contact</p>
      <section className="contact-profile" aria-label="Contact profile">
        <div className="contact-profile-copy">
          <h2>이유진</h2>
          <p>프론트엔드개발자</p>
          <div className="contact-card-details" aria-label="Contact details">
            {contactLinks.map((link) => (
              <a
                href={link.href}
                key={link.label}
                rel={link.href.startsWith("https://") ? "noreferrer" : undefined}
                target={link.href.startsWith("https://") ? "_blank" : undefined}
              >
                {link.value}
              </a>
            ))}
          </div>
        </div>
        <Image
          alt="이유진 증명사진"
          className="contact-photo"
          height={112}
          src="/profile.png"
          width={112}
        />
      </section>
      <div className="contact-mobile-links" aria-label="Contact channels">
        {contactLinks.map((link) => (
          <a
            className="contact-link"
            href={link.href}
            key={link.label}
            rel={link.href.startsWith("https://") ? "noreferrer" : undefined}
            target={link.href.startsWith("https://") ? "_blank" : undefined}
          >
            <span>{link.label}</span>
            <strong>{link.value}</strong>
          </a>
        ))}
      </div>
    </div>
  );
}

export { CalculatorApp };
