import { findByType } from "@/api/configs/master.config";
import type { MasterResponseDto } from "@/api/dtos/master.dto";
import { TYPE_CONTACTS, TYPE_FAQS } from "@/common/types/common";
import {
  mapContactsFromMaster,
  mapFaqsFromMaster,
  type Faq,
  type SupportContact,
} from "@/common/types/type";
import { HomeHeader } from "@/components/TopBar";
import { useLoading } from "@/providers/loadingProvider";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import "./style.scss";

export const SupportPage = () => {
  const { setLoading } = useLoading();
  const [faqsData, setFaqsData] = useState<Faq[]>([]);
  const [contactsData, setContactsData] = useState<SupportContact[]>([]);

  const { data: faqs, isLoading: isLoadingFaqs } = useQuery({
    queryKey: ["faqs", TYPE_FAQS],
    queryFn: () => findByType({ type: TYPE_FAQS, code: "" }),
  });

  const { data: contacts, isLoading: isLoadingContacts } = useQuery({
    queryKey: ["contacts", TYPE_CONTACTS],
    queryFn: () => findByType({ type: TYPE_CONTACTS, code: "" }),
  });

  const isLoading = isLoadingFaqs || isLoadingContacts;

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  useEffect(() => {
    if (!faqs) return;
    const items = Array.isArray(faqs) ? faqs : [faqs];
    setFaqsData(mapFaqsFromMaster(items as MasterResponseDto[]));
  }, [faqs]);

  useEffect(() => {
    if (!contacts) return;
    const items = Array.isArray(contacts) ? contacts : [contacts];
    setContactsData(mapContactsFromMaster(items as MasterResponseDto[]));
  }, [contacts]);

  return (
    <div className="support-page">
      <HomeHeader />

      <main className="support-main">
        <section className="support-hero">
          <p className="support-hero__eyebrow">Trung tâm hỗ trợ</p>
          <h1 className="support-hero__title">Chúng tôi luôn sẵn sàng giúp bạn</h1>
          <p className="support-hero__sub">
            Tìm nhanh các câu hỏi thường gặp hoặc liên hệ trực tiếp với đội ngũ
            CSKH.
          </p>
        </section>

        <section className="support-grid">
          <div className="support-panel">
            <h2 className="support-panel__title">Câu hỏi thường gặp</h2>
            <div className="faq-list">
              {faqsData.map((item) => (
                <article className="faq-item" key={item.id}>
                  <h3 className="faq-item__q">{item.question}</h3>
                  <p className="faq-item__a">{item.answer}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="support-panel">
            <h2 className="support-panel__title">Kênh liên hệ</h2>
            <div className="contact-list">
              {contactsData.map((item) => (
                <article className="contact-item" key={item.id}>
                  <span className="contact-item__label">{item.label}</span>
                  <strong className="contact-item__value">{item.value}</strong>
                  <span className="contact-item__note">{item.note}</span>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
