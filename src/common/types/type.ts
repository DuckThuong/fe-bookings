import type { MasterResponseDto } from "@/api/dtos/master.dto";

export interface Faq {
  id: string;
  question: string;
  answer: string;
}

export interface SupportContact {
  id: string;
  label: string;
  value: string;
  note: string;
}

export const mapFaqsFromMaster = (items: MasterResponseDto[]): Faq[] =>
  [...items]
    .sort((a, b) => a.sort - b.sort)
    .flatMap((item) => {
      try {
        const parsed = JSON.parse(item.rule) as {
          id?: string;
          q?: string;
          a?: string;
        };
        return [
          {
            id: parsed.id ?? item.code,
            question: parsed.q ?? item.name,
            answer: parsed.a ?? "",
          },
        ];
      } catch {
        return [
          {
            id: item.code,
            question: item.name,
            answer: "",
          },
        ];
      }
    });

export const mapContactsFromMaster = (
  items: MasterResponseDto[],
): SupportContact[] =>
  [...items]
    .sort((a, b) => a.sort - b.sort)
    .flatMap((item) => {
      try {
        const parsed = JSON.parse(item.rule) as {
          id?: string;
          label?: string;
          value?: string;
          note?: string;
        };
        return [
          {
            id: parsed.id ?? item.code,
            label: parsed.label ?? item.name,
            value: parsed.value ?? "",
            note: parsed.note ?? "",
          },
        ];
      } catch {
        return [
          {
            id: item.code,
            label: item.name,
            value: "",
            note: "",
          },
        ];
      }
    });
