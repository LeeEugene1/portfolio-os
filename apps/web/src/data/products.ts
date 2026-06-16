export type Product = {
  id: string;
  name: string;
  description: string;
  optionLabel: string;
  salePrice: number;
  originalPrice: number;
  badges: string[];
  deliveryText: string;
  shippingNote: string;
  rating: number;
  reviewCount: number;
  imageTone: string;
};

export const products: Product[] = [
  {
    id: "barilla-pasta",
    name: "[바릴라] 딸리아뗄레 파스타면 500g x 12팩 (총6kg) (1박스)",
    description: "납작한 리본 형태의 파스타면으로 크림, 라구 소스에 잘 어울립니다.",
    optionLabel: "[바릴라] 딸리아뗄레 파스타면 500g x 12팩",
    salePrice: 20990,
    originalPrice: 95000,
    badges: ["떠리싹데이", "백화점상품"],
    deliveryText: "무료배송",
    shippingNote: "단, 제주 및 도서산간지역은 배송비 발생할 수 있습니다.",
    rating: 4.8,
    reviewCount: 13,
    imageTone: "#102b56",
  },
  {
    id: "happy-milk",
    name: "해피반 멸균우유 1.5% (1L*12팩) (업체별도 무료배송)",
    description: "실온 보관 가능한 대용량 멸균우유 패키지입니다.",
    optionLabel: "해피반 멸균우유 1.5% 1L 12팩",
    salePrice: 15990,
    originalPrice: 30500,
    badges: ["떠리싹데이"],
    deliveryText: "무료배송",
    shippingNote: "단, 제주 및 도서산간지역은 배송비 발생할 수 있습니다.",
    rating: 4.6,
    reviewCount: 27,
    imageTone: "#234fc4",
  },
  {
    id: "potato-bread",
    name: "초특가 카스테라처럼 부드러운 호감자 5kg (업체별도 무료배송)",
    description: "구워 먹기 좋은 사이즈의 부드러운 감자 구성입니다.",
    optionLabel: "호감자 5kg",
    salePrice: 9900,
    originalPrice: 19000,
    badges: ["타임특가"],
    deliveryText: "무료배송",
    shippingNote: "단, 제주 및 도서산간지역은 배송비 발생할 수 있습니다.",
    rating: 4.9,
    reviewCount: 102,
    imageTone: "#d58f2f",
  },
];
