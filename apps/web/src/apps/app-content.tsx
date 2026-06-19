"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { CalculatorApp } from "./calculator/calculator-app";

export { StoreApp } from "./store-app";

type PortfolioSection = {
  title: string;
  items: string[];
};

type PortfolioPart = {
  id: string;
  label: string;
  path: string;
  prompt: string;
  name: string;
  tagline: string;
  meta?: string;
  link?: {
    href: string;
    label: string;
  };
  sections: PortfolioSection[];
};

const portfolioParts: PortfolioPart[] = [
  {
    id: "whoami",
    label: "$ whoami",
    path: "~/portfolio",
    prompt: "whoami",
    name: "Eugene Lee",
    tagline: "Frontend Developer · 이커머스 · AI · 블록체인",
    sections: [
      {
        title: "Highlights",
        items: [
          "1인 프론트엔드 담당으로 이커머스 운영, 기획, 배포 전 과정 수행",
          "SEO Lighthouse 100 달성, CLS 0.6에서 0.1로 개선",
          "블록체인 지갑과 NFT 연동 기반 글로벌 P2E 게임 출시 경험",
        ],
      },
      {
        title: "Currently",
        items: [
          "Thirtymall 이커머스 프론트엔드 운영",
          "성능, 안정성, 사용자 경험을 데이터 기반으로 개선",
        ],
      },
    ],
  },
  {
    id: "thirtymall",
    label: "thirtymall",
    path: "~/portfolio/projects/thirtymall",
    prompt: "cat projects/thirtymall/README.md",
    name: "Thirtymall",
    tagline: "E-commerce",
    meta: "Frontend Sole Developer · React, TypeScript, Next.js, Material UI",
    link: { href: "https://thirtymall.com", label: "thirtymall.com" },
    sections: [
      {
        title: "Results",
        items: [
          "장바구니 응답 속도 1.5s에서 0.6s로 개선",
          "개인화 추천 영역 리뉴얼로 메인 페이지 클릭 수 10K 이상 증가",
          "외부 URL 접근과 새로고침 후에도 breadcrumb와 상품 그리드 상태 복원",
        ],
      },
      {
        title: "Reliability",
        items: [
          "로그인 실패 케이스를 수집, 분류하고 빈도 기반으로 대응",
          "OAuth state 파라미터 기반 리다이렉트 복구",
          "PC 결제 완료 후 팝업 자동 종료로 결제 인지 UX 개선",
        ],
      },
    ],
  },
  {
    id: "caveduck",
    label: "caveduck",
    path: "~/portfolio/projects/caveduck",
    prompt: "cat projects/caveduck/README.md",
    name: "Caveduck",
    tagline: "AI Character Chat Platform",
    meta: "Frontend Developer · Angular, JavaScript, Tailwind CSS, Node.js",
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
    path: "~/portfolio/projects/sheepfarm",
    prompt: "cat projects/sheepfarm/README.md",
    name: "Sheepfarm",
    tagline: "Blockchain P2E Game",
    meta: "Frontend Developer · React, TypeScript, Web3",
    sections: [
      {
        title: "Launch",
        items: [
          "지갑 연결, NFT 보유 상태, 토큰 기반 게임 흐름을 프론트엔드에서 구현",
          "글로벌 사용자를 고려한 반응형 UI와 상태 안내를 구성",
        ],
      },
      {
        title: "Web3 UX",
        items: [
          "블록체인 트랜잭션의 대기, 성공, 실패 상태를 사용자 흐름에 맞춰 표현",
          "지갑 연결 오류와 네트워크 불일치 상황을 명확한 인터페이스로 안내",
        ],
      },
    ],
  },
  {
    id: "skills",
    label: "$ skills --list",
    path: "~/portfolio/skills",
    prompt: "skills --list",
    name: "Skills",
    tagline: "Frontend execution stack",
    sections: [
      {
        title: "Frontend",
        items: ["React", "Next.js", "TypeScript", "Angular", "Tailwind CSS"],
      },
      {
        title: "Product Quality",
        items: ["Performance tuning", "SEO", "WebView 대응", "A/B 개선", "운영 자동화"],
      },
    ],
  },
];

const resumeProjects = portfolioParts.filter((part) =>
  ["thirtymall", "caveduck", "sheepfarm"].includes(part.id),
);

const resumeExperience = [
  {
    company: "핌아시아",
    period: "2024.04 ~ 2026.05 (2년 1개월)",
    roles: [
      {
        title: "이커머스 모바일 웹 프론트엔드 개발 (떠리몰)",
        description:
          "MAU 240만 규모 떠리몰 모바일 웹과 Flutter WebView 기반 구매 전환 플로우를 개발하고 운영했습니다.",
        highlights: [
          "iOS WKWebView 쿠키 반영 지연을 분석해 Callback accessToken을 클라이언트 쿠키에 동기화하고, 로그인 직후 5분 내 401 인증 오류를 170건에서 20건으로 88% 감소",
          "수량 변경 debounce 조정과 가격 조회 병렬 처리로 장바구니 가격 반영 시간을 1.5초에서 0.6초로 60% 단축",
          "PC/Mobile, 회원/비회원 장바구니 로직을 모노레포 공통 패키지(@repo/common)로 통합해 코드량 2.2% 감소",
          "useInView 지연 로딩, Redux/메모리 캐싱, Virtuoso 가상 리스트, 스크롤 복원, 이미지 최적화로 상품 탐색 UX 개선",
          "최근 본 상품 기반 개인화 추천 섹션을 구축해 추천 영역 월 평균 클릭 100만 달성",
          "page → section → item 이벤트 텍소노미와 DataTagWrapper를 설계해 52개 페이지 마케팅 이벤트 추적 표준화",
          "Claude Code 기반 Plan-Generate-Check 오케스트레이터와 Codex/Claude/Gemini 병렬 PR 리뷰 워크플로우 구성",
          "Jira 기반 데일리 TODO 알림, 주간 웹 퍼포먼스 측정, Playwright 스크린샷, 릴리즈/RCA/스펙 문서 자동화",
        ],
        stack: "Next.js, React, TypeScript, Redux Toolkit, Material UI",
      },
      {
        title: "백오피스 프론트 개발",
        description:
          "이커머스 운영 어드민의 주문, 상품, 마케팅, CS, 통계 관리 화면과 운영 자동화 화면을 개발했습니다.",
        highlights: [
          "SCSS 공통 스타일과 공통 컴포넌트로 백오피스 UI 일관성과 개발 재사용성 확보",
          "AG Grid 공통 모듈화와 엑셀 다운로드 컴포넌트 구축으로 반복 구현 비용 감소",
          "거래처 관리 칸반보드 신규 개발 및 Figma AI 생성 화면을 기존 SCSS/컴포넌트/상태관리 패턴에 맞추는 프롬프트 하네스 설계",
          "Node 22 기반 Dockerfile 작성, 환경별 빌드/실행 절차와 ESLint/Prettier 설정 가이드 문서화",
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
        description:
          "AI 캐릭터 채팅 플랫폼의 성능, SEO, 운영 자동화와 콘텐츠 관리 흐름을 개선했습니다.",
        highlights: [
          "이미지 최적화와 Skeleton Loader 도입으로 Lighthouse 100점 달성, CLS 0.6에서 0.1로 개선, 초기 로딩 시간 1초 단축",
          "AWS Lambda 기반 주간 크리에이터 랭킹 시스템 구축으로 캐릭터 등록률 10% 상승",
          "Retool과 Slack 알림을 활용한 신고 캐릭터 자동 비노출 시스템 구축",
          "S3 기반 TTS 음성 파일 캐싱 및 음성 재생 성능 최적화",
        ],
        stack: "Angular, Node.js, Tailwind CSS, Retool, Lambda, EC2",
      },
      {
        title: "블록체인 게임 웹사이트 프론트엔드 개발 (Sheepfarm in metaland)",
        description:
          "Web3 게임 서비스의 사용자 거래 플로우, 네트워크 확장 구조, 관리자 시스템을 구현했습니다.",
        highlights: [
          "지갑 인증, NFT 민팅, FT 구매 등 Web3 사용자 거래 플로우 구현",
          "Oasys Homeverse, Kroma, Skale 등 다중 네트워크 구조를 설계해 신규 네트워크 추가 시 코드 변경 최소화",
          "관리자 시스템 React 마이그레이션으로 컴포넌트 구조 통일 및 유지보수 효율 개선",
          "AWS EC2 테스트 서버 구축으로 배포 검증 환경 분리",
        ],
        stack: "React, TypeScript, JavaScript, SCSS, Node.js, Vite, EC2",
      },
    ],
  },
  {
    company: "휴네이처",
    period: "2021.03 ~ 2022.03 (1년)",
    roles: [
      {
        title: "공군 전파탐지기 소프트웨어 웹 개발",
        description: "공통 UI 컴포넌트와 비대면 체크인용 API를 개발했습니다.",
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
        description:
          "의약품 QR 스캔 앱, AI 신약개발 플랫폼, 화학 분석 모듈, 주파수 정보 앱의 UI/UX와 반응형 화면을 설계했습니다.",
        highlights: ["포트폴리오: leeeugene1.github.io/UX_Portfolio"],
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
    detail: "Java 기반의 응용 소프트웨어엔지니어링 실무과정 수료",
  },
  {
    name: "건양대학교 패션디자인산업학과",
    period: "2011.03 ~ 2015.02",
    detail: "졸업",
  },
];
export function PortfolioApp() {
  const [activePartId, setActivePartId] = useState(portfolioParts[0].id);
  const activeIndex = portfolioParts.findIndex((part) => part.id === activePartId);
  const activePart = portfolioParts[Math.max(0, activeIndex)];

  return (
    <div className="terminal-portfolio" aria-label="Terminal portfolio">
      <header className="terminal-header">
        <span className="terminal-dot terminal-dot-red" aria-hidden="true" />
        <span className="terminal-dot terminal-dot-yellow" aria-hidden="true" />
        <span className="terminal-dot terminal-dot-green" aria-hidden="true" />
        <span className="terminal-path">
          eugene@portfolio: <strong>{activePart.path}</strong>
        </span>
      </header>

      <nav className="terminal-tabs" aria-label="Portfolio parts">
        {portfolioParts.map((part, index) => (
          <button
            aria-pressed={part.id === activePart.id}
            className="terminal-tab"
            key={part.id}
            onClick={() => setActivePartId(part.id)}
            type="button"
          >
            <span>{index + 1}</span>
            {part.label}
          </button>
        ))}
      </nav>

      <article className="terminal-panel">
        <p className="terminal-prompt">$ {activePart.prompt}</p>
        <div className="terminal-title-row">
          <div>
            <h2>
              {activePart.name}
              {activePart.id === "whoami" ? (
                <span className="terminal-cursor" aria-hidden="true" />
              ) : null}
            </h2>
            <p>{activePart.tagline}</p>
            {activePart.meta ? <p className="terminal-meta">{activePart.meta}</p> : null}
          </div>
          {activePart.link ? (
            <a
              className="terminal-link"
              href={activePart.link.href}
              rel="noreferrer"
              target="_blank"
            >
              {activePart.link.label}
            </a>
          ) : null}
        </div>

        <div className="terminal-sections">
          {activePart.sections.map((section) => (
            <section className="terminal-section" key={section.title}>
              <h3>{section.title}</h3>
              <ul>
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </article>

      <footer className="terminal-progress" aria-label="Portfolio progress">
        <span>
          Part {Math.max(0, activeIndex) + 1}/{portfolioParts.length}
        </span>
        <progress value={Math.max(0, activeIndex) + 1} max={portfolioParts.length} />
      </footer>
    </div>
  );
}

export function ResumeApp() {
  const totalProjects = useMemo(() => resumeProjects.length, []);

  function handlePrint() {
    window.print();
  }

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
          <button className="app-link" onClick={handlePrint} type="button">
            인쇄
          </button>
        </div>
      </header>

      <section className="resume-contact" aria-label="Resume contact">
        <a href="mailto:uwm1004@gmail.com">uwm1004@gmail.com</a>
        <a href="tel:01056526287">010 5652 6287</a>
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
          로그인 오류 88% 개선, 월 100만+ 클릭 개인화 섹션 구축, Lighthouse 100점 경험을
          가진 5년 차 프론트엔드 개발자입니다. Next.js / React 기반 커머스 서비스에서 인증,
          상품 탐색, 장바구니, 추천, 백오피스 운영 화면을 개발했으며, 성능, 안정성, 운영
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
                  <p>{role.description}</p>
                  <ul>
                    {role.highlights.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
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

      <footer className="resume-footer">
        <span>{totalProjects} featured projects</span>
        <a href="mailto:uwm1004@gmail.com">uwm1004@gmail.com</a>
        <a href="https://github.com/LeeEugene1" rel="noreferrer" target="_blank">
          github.com/LeeEugene1
        </a>
      </footer>
    </article>
  );
}

export function ContactApp() {
  return (
    <div className="app-content contact-app">
      <section className="contact-profile" aria-label="Contact profile">
        <Image
          alt="이유진 증명사진"
          className="contact-photo"
          height={112}
          src="/profile.png"
          width={112}
        />
        <div className="contact-profile-copy">
          <p className="eyebrow">Resume</p>
          <h2>이유진</h2>
          <p>5년 차 프론트엔드 개발자 · Next.js / React · 커머스 / AI / WebView</p>
        </div>
      </section>
    </div>
  );
}

export { CalculatorApp };
