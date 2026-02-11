# 검역량 인사이트 대시보드 📊

연도별 검역량 데이터를 분석하고 시각화하는 Next.js 기반 대시보드 애플리케이션입니다.

## ✨ 주요 기능

- 📤 **엑셀 파일 업로드**: 드래그 앤 드롭으로 간편하게 데이터 업로드 (.xlsx, .xls)
- 🔍 **스마트 컬럼 매칭**: 다양한 컬럼명을 자동으로 인식하여 파싱
- 📊 **실시간 인사이트**: KPI 카드로 주요 지표 한눈에 확인
  - 총 검역량
  - 연도 범위
  - YoY 성장률
  - 상위 국가/품목
- 📈 **인터랙티브 차트**: Recharts를 활용한 동적 차트
  - 연도별 트렌드 차트
  - 국가별 분포 (파이 차트)
  - 품목별 분포 (바 차트)
- 🔎 **강력한 필터링**: 검색, 연도, 품목, 국가별 필터
- 📋 **데이터 테이블**: TanStack Table을 활용한 정렬, 페이지네이션 지원

## 🛠️ 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Table**: TanStack Table
- **Excel Parsing**: SheetJS (xlsx)
- **Icons**: Lucide React

## 📦 설치 방법

```bash
# 저장소 클론
git clone https://github.com/YOUR_USERNAME/검역량-인사이트.git

# 디렉토리 이동
cd 검역량-인사이트

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

서버가 실행되면 브라우저에서 [http://localhost:3001](http://localhost:3001)로 접속하세요.

## 📊 데이터 형식

업로드하는 엑셀 파일은 다음 컬럼들을 포함해야 합니다:

| 컬럼명 | 설명 | 필수 여부 |
|--------|------|-----------|
| 품명 | 품목명 (예: 소정육) | ✅ 필수 |
| 구분 | 분류 (예: 냉동, 냉장, 가금) | ⭕ 선택 |
| 부위 | 부위 (예: 갈비, 등심, 삼겹살) | ⭕ 선택 |
| 국가명 | 수출국 (예: 미국, 호주) | ✅ 필수 |
| 검역량 | 검역량 (숫자) | ✅ 필수 |
| 연도 | 연도 (예: 2026) | ✅ 필수 |
| 월 | 월 (1-12) | ⭕ 선택 |

### 지원하는 컬럼명 변형

애플리케이션은 다양한 컬럼명을 자동으로 인식합니다:

- **품명**: 품명, 품목, 대분류, category
- **구분**: 구분, 분류, 타입, type, classification
- **부위**: 부위, 세부품명, part, product
- **국가명**: 국가명, 국가, 수출국, country, origin
- **검역량**: 검역량, 중량, 수량, weight, volume, quantity
- **연도**: 연도, 년도, year
- **월**: 월, month

## 🚀 사용 방법

1. **애플리케이션 실행**: `npm run dev`
2. **브라우저 접속**: http://localhost:3001
3. **엑셀 파일 업로드**: 드래그 앤 드롭 또는 파일 선택
4. **데이터 분석**: 자동으로 생성되는 차트와 인사이트 확인
5. **필터 적용**: 원하는 조건으로 데이터 필터링

## 📁 프로젝트 구조

```
검역량-인사이트/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 루트 레이아웃
│   ├── page.tsx           # 메인 페이지
│   └── globals.css        # 글로벌 스타일
├── components/            # React 컴포넌트
│   ├── UploadBox.tsx     # 파일 업로드 컴포넌트
│   ├── Filters.tsx       # 필터 컴포넌트
│   ├── KpiCards.tsx      # KPI 카드 컴포넌트
│   ├── Charts.tsx        # 차트 컴포넌트
│   └── DataTable.tsx     # 데이터 테이블 컴포넌트
├── lib/                   # 유틸리티 함수
│   ├── types.ts          # TypeScript 타입 정의
│   ├── parseXlsx.ts      # 엑셀 파싱 로직
│   └── aggregate.ts      # 데이터 집계 로직
└── package.json          # 프로젝트 설정
```

## 🎨 주요 컴포넌트

### UploadBox
- 드래그 앤 드롭 파일 업로드
- 파일 형식 검증
- 로딩 상태 표시

### Filters
- 전역 검색
- 연도별 필터
- 품목별 필터
- 국가별 필터
- 필터 칩 (선택된 필터 표시)

### KpiCards
- 총 검역량
- 연도 범위
- YoY 성장률
- 상위 국가 (Top 5)
- 상위 품목 (Top 5)

### Charts
- 연도별 트렌드 (라인 차트)
- 국가별 분포 (파이 차트)
- 품목별 분포 (바 차트)

### DataTable
- 정렬 가능한 컬럼
- 페이지네이션
- 행 선택
- 반응형 디자인

## 🔧 개발 스크립트

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# 린트 실행
npm run lint
```

## 📝 라이선스

MIT License

## 👨‍💻 개발자

LDH

## 🤝 기여

이슈와 풀 리퀘스트는 언제나 환영합니다!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
