"use client";

import { CSSProperties, ReactNode } from "react";
import { DeskSkin } from "@/lib/types";

function grain(a: number, f: string) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='700' height='700'><filter id='g'><feTurbulence type='fractalNoise' baseFrequency='${f}' numOctaves='4' seed='7'/><feColorMatrix values='0 0 0 0 0.14  0 0 0 0 0.07  0 0 0 0 0.03  0 0 0 ${a} -0.3'/></filter><rect width='100%' height='100%' filter='url(%23g)'/></svg>`;
  return `url("data:image/svg+xml;utf8,${svg}")`;
}

const LIGHT = "radial-gradient(110% 80% at 6% -8%, rgba(255,214,150,.34), transparent 55%)";
const PANES =
  "linear-gradient(118deg, transparent 0 34%, rgba(255,226,172,.07) 34% 44%, transparent 44% 47%, rgba(255,226,172,.07) 47% 57%, transparent 57%)";
const VIG = "radial-gradient(140% 100% at 50% 40%, transparent 50%, rgba(20,10,4,.42))";

function surfaceLayers(kind: DeskSkin): { image: string; color: string } {
  switch (kind) {
    case "dark":
      return { image: `${LIGHT}, ${PANES}, ${VIG}, ${grain(1.3, "0.0025 0.11")}`, color: "#5d3c27" };
    case "light":
      return {
        image: `${LIGHT}, ${PANES}, radial-gradient(140% 100% at 50% 40%, transparent 55%, rgba(60,30,10,.28)), ${grain(0.8, "0.003 0.12")}`,
        color: "#c89a66",
      };
    case "white":
      return {
        image: `radial-gradient(110% 80% at 6% -8%, rgba(255,236,200,.45), transparent 55%), linear-gradient(118deg, transparent 0 34%, rgba(255,240,210,.25) 34% 44%, transparent 44% 47%, rgba(255,240,210,.25) 47% 57%, transparent 57%), radial-gradient(140% 100% at 50% 40%, transparent 55%, rgba(60,45,30,.16)), ${grain(0.22, "0.003 0.14")}`,
        color: "#f3efe7",
      };
  }
}

export function surfaceCss(kind: DeskSkin, mobile: boolean): CSSProperties {
  const { image, color } = surfaceLayers(kind);
  return {
    flex: 1,
    overflowY: "auto",
    overflowX: "hidden",
    backgroundImage: image,
    backgroundColor: color,
    backgroundAttachment: "local",
    transition: "background-color .4s",
    padding: mobile ? "10px 0 30px" : "44px 40px 30px",
  };
}

export default function DeskSurface({
  skin,
  mobile,
  children,
}: {
  skin: DeskSkin;
  mobile: boolean;
  children: ReactNode;
}) {
  return <div style={surfaceCss(skin, mobile)}>{children}</div>;
}
