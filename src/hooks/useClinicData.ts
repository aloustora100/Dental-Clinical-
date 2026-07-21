/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { dataManager } from "../utils/dataManager";
import {
  BeforeAfterTreatment,
  Service,
  Offer,
  Branch,
  Testimonial,
  FAQItem,
  ClinicSettings
} from "../types";

export function useClinicData() {
  const [data, setData] = useState({
    settings: dataManager.getSettings(),
    services: dataManager.getServices(),
    beforeAfter: dataManager.getBeforeAfter(),
    offers: dataManager.getOffers(),
    branches: dataManager.getBranches(),
    testimonials: dataManager.getTestimonials(),
    faqs: dataManager.getFAQs()
  });

  useEffect(() => {
    const handleUpdate = () => {
      setData({
        settings: dataManager.getSettings(),
        services: dataManager.getServices(),
        beforeAfter: dataManager.getBeforeAfter(),
        offers: dataManager.getOffers(),
        branches: dataManager.getBranches(),
        testimonials: dataManager.getTestimonials(),
        faqs: dataManager.getFAQs()
      });
    };

    window.addEventListener("clinic-data-updated", handleUpdate);
    return () => window.removeEventListener("clinic-data-updated", handleUpdate);
  }, []);

  return data;
}
