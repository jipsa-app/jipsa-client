import { useState } from 'react'

const docs = [
  {
    id: 'registry',
    icon: '📋',
    title: '등기부등본',
    subtitle: '소유권·근저당 확인의 핵심',
    cardBg: '#FCEBEB',
    cardBorder: '#F5BABA',
    cardColor: '#791F1F',
    accentColor: '#E24B4A',
    badge: '가장 중요',
    badgeStyle: 'bg-[#E24B4A] text-white',
    where: '인터넷등기소 (700원) · 정부24',
    whereUrl: 'https://www.iros.go.kr',
    sections: [
      {
        title: '표제부',
        lines: ['소재지번 서울특별시 ○○구 ○○동 ○○번지', '건물내역 철근콘크리트구조 15층 중 3층', '전유부분 제3층 제302호 면적 59.94㎡'],
      },
      {
        title: '갑구 (소유권)',
        lines: ['순위 1번 | 소유권보존 | 2019년 6월 15일', '소유자 홍 ○ 동 (가나1234567890)', '주소 서울특별시 ○○구 ○○동 ○○아파트 302호'],
        markers: [
          {
            id: 'A',
            color: '#E24B4A',
            bg: '#FCEBEB',
            label: 'A',
            title: '갑구 소유자 확인',
            desc: '계약 상대방 신분증 이름과 정확히 일치해야 합니다. 대리인 계약 시 위임장 필수.',
          },
        ],
      },
      {
        title: '을구 (소유권 이외)',
        lines: ['순위 1번 | 근저당권설정 | 2019년 6월 20일', '채권최고액 금 2억 4,000만원', '채무자 홍○동 | 근저당권자 ○○은행'],
        markers: [
          {
            id: 'B',
            color: '#E24B4A',
            bg: '#FCEBEB',
            label: 'B',
            title: '을구 채권최고액',
            desc: '근저당 해소로 위험. 내 보증금 + 채권최고액 합산이 집값의 80%를 넘으면 계약 금지.',
          },
          {
            id: 'C',
            color: '#BA7517',
            bg: '#FAEEDA',
            label: 'C',
            title: '을구 전세권',
            desc: '기존 전세권이 있다면 합산액 80% 초과 여부 확인. 전세권자 동의 없이 계약 불가.',
          },
        ],
      },
    ],
  },
  {
    id: 'contract',
    icon: '📝',
    title: '임대차 계약서',
    subtitle: '계약 내용 꼼꼼히 확인',
    cardBg: '#FAEEDA',
    cardBorder: '#E8C88A',
    cardColor: '#633806',
    accentColor: '#BA7517',
    badge: null,
    badgeStyle: '',
    where: '정부24 (확정일자용) · HUG (전세보증보험)',
    whereUrl: 'https://www.gov.kr',
    sections: [
      {
        title: '임대 목적물',
        lines: ['소재지 서울특별시 ○○구 ○○동 ○○호', '임대차 목적물 아파트 · 면적 59.94㎡', '임대 기간 2025.03.01 ~ 2027.02.28 (24개월)'],
      },
      {
        title: '계약 내용',
        lines: ['보증금 금 이억원 (₩200,000,000)', '월세 금 사십만원 (₩400,000) 매월 1일 지급', '관리비 금 십만원 (인터넷·주차 포함)'],
        markers: [
          {
            id: 'A',
            color: '#E24B4A',
            bg: '#FCEBEB',
            label: 'A',
            title: '보증금·월세 확인',
            desc: '구두 합의와 계약서 금액이 일치하는지 반드시 확인. 숫자와 한글 병기 확인.',
          },
        ],
      },
      {
        title: '특약사항',
        lines: ['1. 임대인은 입주 전 배·수관 교체 의무', '2. 퇴실 시 원상복구는 임대인 부담', '3. 계약 기간 중 보증금 인상 금지'],
        markers: [
          {
            id: 'B',
            color: '#BA7517',
            bg: '#FAEEDA',
            label: 'B',
            title: '특약 3가지 필수',
            desc: '근저당 금지 / 보증보험 협조 / 원상복구 조건 — 없으면 직접 작성해서 서명 받으세요.',
          },
        ],
      },
    ],
  },
  {
    id: 'building',
    icon: '🏢',
    title: '건축물대장',
    subtitle: '불법건축물·면적 확인',
    cardBg: '#EAF3DE',
    cardBorder: '#B0D48A',
    cardColor: '#27500A',
    accentColor: '#639922',
    badge: null,
    badgeStyle: '',
    where: '정부24 (무료)',
    whereUrl: 'https://www.gov.kr',
    sections: [
      {
        title: '건물 현황',
        lines: ['대지위치 서울특별시 ○○구 ○○동 ○○번지', '주용도 공동주택 (아파트)', '건축연도 2019년 7월 준공'],
      },
      {
        title: '전유 부분 현황',
        lines: ['전유면적 59.94㎡ (18.12평)', '구조 철근콘크리트구조', '층수 지상 3층'],
        markers: [
          {
            id: 'A',
            color: '#639922',
            bg: '#EAF3DE',
            label: 'A',
            title: '면적 확인',
            desc: '등기부등본·매물 면적과 일치하는지 비교. 다르면 불법 증개축 가능성.',
          },
        ],
      },
      {
        title: '위반건축물 여부',
        lines: ['위반건축물: 없음', '사용승인: 2019년 8월 15일', '관할청: ○○구청'],
        markers: [
          {
            id: 'B',
            color: '#E24B4A',
            bg: '#FCEBEB',
            label: 'B',
            title: '위반건축물 체크',
            desc: '위반건축물이면 계약 금지. 대출·전세보험 가입도 불가합니다.',
          },
        ],
      },
    ],
  },
  {
    id: 'insurance',
    icon: '🛡️',
    title: '전세보증보험 확인서',
    subtitle: '보증금 반환 안전장치',
    cardBg: '#E6F1FB',
    cardBorder: '#A8C8E8',
    cardColor: '#0C447C',
    accentColor: '#185FA5',
    badge: null,
    badgeStyle: '',
    where: 'HUG · HF · SGI 서울보증',
    whereUrl: 'https://www.khug.or.kr',
    sections: [
      {
        title: '보증 정보',
        lines: ['보증번호 JXXX-2025-XXXXXX', '보증금액 금 이억원 (₩200,000,000)', '보증기간 2025.03.01 ~ 2027.02.28'],
        markers: [
          {
            id: 'A',
            color: '#639922',
            bg: '#EAF3DE',
            label: 'A',
            title: '보증금·기간 확인',
            desc: '집주인이 돌려주지 않으면 HUG가 대신 지급. 보증금액 = 계약서 금액과 동일해야 함.',
          },
        ],
      },
      {
        title: '주채무자 / 피보증인',
        lines: ['주채무자(임대인) 홍○동', '피보증인(임차인) 김○○', '주소 서울특별시 ○○구 ○○동 302호'],
        markers: [
          {
            id: 'B',
            color: '#185FA5',
            bg: '#E6F1FB',
            label: 'B',
            title: '보험료 안내',
            desc: '연 보증금의 0.1~0.4%. 보증금 2억 기준 연 20~80만원 수준.',
          },
        ],
      },
    ],
  },
]

function DocList({ onSelect }) {
  return (
    <div className="mx-auto max-w-mobile min-h-screen flex flex-col bg-gray-50">
      {/* 뒤로가기 버튼 누락 */}
      <div className="bg-white px-5 pt-5 pb-5 border-b border-gray-100">
        <div className="text-3xl mb-2">📄</div>
        <h1 className="text-xl font-bold text-gray-900">서류 미리보기</h1>
        <p className="text-sm text-gray-500 mt-1">각 서류를 탭하면 읽는 법을 알려드려요</p>
      </div>
      <div className="px-4 py-4 space-y-3 flex-1">
        {docs.map((doc) => (
          <button
            key={doc.id}
            onClick={() => onSelect(doc.id)}
            className="w-full text-left rounded-xl border p-4 flex items-center gap-4 active:scale-[0.98] transition-transform"
            style={{ backgroundColor: doc.cardBg, borderColor: doc.cardBorder }}
          >
            <div className="w-12 h-12 rounded-xl bg-white/60 flex items-center justify-center text-2xl flex-shrink-0">
              {doc.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-bold text-sm" style={{ color: doc.cardColor }}>{doc.title}</span>
                {doc.badge && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${doc.badgeStyle}`}>{doc.badge}</span>
                )}
              </div>
              <p className="text-xs" style={{ color: doc.cardColor + '99' }}>{doc.subtitle}</p>
            </div>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 3.5L10.5 8L6 12.5" stroke={doc.accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        ))}
      </div>
    </div>
  )
}

function DocDetail({ doc, onBack }) {
  const [activeMarker, setActiveMarker] = useState(null)

  const allMarkers = doc.sections.flatMap((s) => s.markers || [])

  const toggleMarker = (id) => setActiveMarker((cur) => (cur === id ? null : id))

  const activeInfo = allMarkers.find((m) => m.id === activeMarker)

  return (
    <div className="mx-auto max-w-mobile min-h-screen flex flex-col bg-gray-50">
      <Header
        title={doc.title}
        badge="샘플 서류"
        badgeStyle="bg-gray-100 text-gray-500"
        onBack={onBack}
      />

      <div className="px-4 py-4 space-y-4 flex-1 overflow-y-auto">
        {/* 안내 배너 */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-center gap-2">
          <span className="text-sm">👆</span>
          <p className="text-xs text-blue-700">색상 마커를 탭하면 해당 항목 설명이 나와요</p>
        </div>

        {/* 마커 활성 정보 */}
        {activeInfo && (
          <div
            className="rounded-xl border px-4 py-3 space-y-1 transition-all"
            style={{ backgroundColor: activeInfo.bg, borderColor: activeInfo.color + '44' }}
          >
            <p className="font-bold text-sm" style={{ color: activeInfo.color }}>{activeInfo.title}</p>
            <p className="text-sm leading-relaxed" style={{ color: activeInfo.color + 'DD' }}>{activeInfo.desc}</p>
          </div>
        )}

        {/* 가짜 서류 UI */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="bg-gray-800 text-white text-center py-2.5 text-xs font-semibold tracking-wide">
            {doc.title.toUpperCase()} — 샘플 (말소사항 포함)
          </div>
          <div className="p-4 space-y-4 font-mono text-xs">
            {doc.sections.map((section, si) => (
              <div key={si}>
                <div className="bg-gray-100 rounded px-2 py-1 font-bold text-gray-700 text-[11px] mb-2">
                  【 {section.title} 】
                </div>
                <div className="space-y-1.5 pl-2">
                  {section.lines.map((line, li) => (
                    <div key={li} className="text-gray-600 leading-relaxed">{line}</div>
                  ))}
                  {section.markers && section.markers.length > 0 && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {section.markers.map((marker) => (
                        <button
                          key={marker.id}
                          onClick={() => toggleMarker(marker.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all"
                          style={{
                            backgroundColor: activeMarker === marker.id ? marker.color : marker.bg,
                            borderColor: marker.color,
                            color: activeMarker === marker.id ? 'white' : marker.color,
                          }}
                        >
                          <span>{marker.label}</span>
                          <span className="font-normal">{marker.title}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 발급처 */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-2">
          <p className="text-xs font-semibold text-gray-500">발급처</p>
          <a
            href={doc.whereUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between"
          >
            <span className="text-sm text-gray-700">{doc.where}</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7H12M8 3L12 7L8 11" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}

export default function Documents() {
  const [selected, setSelected] = useState(null)

  const doc = docs.find((d) => d.id === selected)

  if (doc) return <DocDetail doc={doc} onBack={() => setSelected(null)} />
  return <DocList onSelect={setSelected} />
}
