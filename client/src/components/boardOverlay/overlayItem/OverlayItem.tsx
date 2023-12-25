import { PropsWithChildren, ReactNode } from "react";

export interface IOverlayItemProps extends PropsWithChildren {
  children: ReactNode,
  className: string
}

export default function OverlayItem(props: IOverlayItemProps) {
  return (
    <div className={`shadow-lg bg-white absolute pointer-events-auto rounded-md ${props.className}`}>
      {props.children}
    </div>
  );
}