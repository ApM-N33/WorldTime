import Swiper from "swiper"
import { Navigation, Pagination } from "swiper/modules"

Swiper.use([Navigation, Pagination])

export function setupSwiper() {
  new Swiper(".swiper", {
    loop: true,
    autoplay: false,
    grabCursor: true,
    slidesPerView: 1,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  })
}
