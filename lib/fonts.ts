import localFont from "next/font/local";

export const vazirmatn = localFont({
  src: [
    {
      path: "../app/fonts/Vazir-light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../app/fonts/Vazir.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../app/fonts/Vazir-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../app/fonts/Vazir-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../app/fonts/Vazir-Black.ttf",
      weight: "900",
      style: "normal",
    }
  ],
  variable: "--font-vazirmatn",
  display: "swap",
});