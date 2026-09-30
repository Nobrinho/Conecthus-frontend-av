/*
 * Ícones do protótipo, extraídos dos vetores do Adobe XD (não são de uma
 * biblioteca). Todos pintam com `currentColor`, então a cor vem do texto ao
 * redor e, por consequência, dos tokens do tema. São decorativos por padrão
 * (`aria-hidden`); o nome acessível fica no botão/link que os contém.
 *
 * Arquivo gerado a partir dos SVGs do XD: para trocar um ícone, substitua o
 * conteúdo mantendo o `viewBox` original do desenho.
 */
import type { SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement>;

function createIcon(viewBox: string, children: React.ReactNode) {
  function Icon({ className, ...props }: IconProps) {
    return (
      <svg
        viewBox={viewBox}
        aria-hidden
        focusable="false"
        className={className ?? "size-6"}
        {...props}
      >
        {children}
      </svg>
    );
  }
  return Icon;
}

/** Home (menu lateral). */
export const HomeIcon = createIcon(
  "33.71 143.31 22.58 21.38",
  <>
    <g fill="currentColor" transform="translate(33 142)">
      <path d="M9.98 8.3q.02 2.21 0 4.42c-.01.44.12.76.43 1.07l5.92 5.9c.6.6.56.9-.12 1.36-5.76 3.9-14 .49-15.3-6.33A10 10 0 0 1 8.95 2.8c.75-.15 1.03.07 1.03.85zm3.83 11.84.12-.24q-.29-.18-.54-.4l-4.55-4.53a2.5 2.5 0 0 1-.78-1.92q.02-3.62 0-7.25c0-.23-.04-.45-.06-.76-2.92 1.22-4.79 3.24-5.26 6.3-.52 3.45.69 6.27 3.65 8.17a7.9 7.9 0 0 0 7.42.63" />
      <path d="M12.09 11.28V2.35c0-.88.21-1.08 1.09-1.03a9.4 9.4 0 0 1 8.87 9.13c-.01.6-.23.83-.85.83h-9.12m7.93-2.05c-.16-.49-.28-1-.48-1.45a7.4 7.4 0 0 0-5.02-4.3c-.32-.1-.54-.1-.54.33q0 2.58.02 5.14c0 .13.21.37.33.37q2.73.02 5.47 0 .06 0 .22-.1m-7.12 4.18c.27-.02.45-.04.62-.04h8.59q.3 0 .6.04.66.07.58.72a9.4 9.4 0 0 1-3.07 5.85c-.38.35-.7.12-1-.18q-2.98-3-5.95-5.96z" />
    </g>
  </>,
);

/** Controle de Acesso (menu lateral). */
export const AccessControlIcon = createIcon(
  "36.98 202.31 16.03 21.37",
  <>
    <g transform="translate(33 201)">
      <path
        fill="currentColor"
        d="M3.99 12.02V4.29c0-1.85 1.1-2.97 2.94-2.97h10.1c1.83 0 2.96 1.08 2.97 2.9q.03 7.78 0 15.57c0 1.85-1.12 2.9-2.95 2.9H6.9c-1.78 0-2.9-1.11-2.9-2.88zm8 6.74h3.78c.77 0 1-.29.92-1.06a3.26 3.26 0 0 0-3.25-3.01q-1.3-.02-2.61 0c-1.98 0-3.2 1.03-3.53 2.97-.14.77.13 1.1.92 1.1zm-.06-5.39a2.7 2.7 0 1 0 .1-5.39 2.67 2.67 0 0 0-2.75 2.71 2.67 2.67 0 0 0 2.65 2.68m.08-9.4h-1.95c-.42-.01-.72.14-.77.59-.05.46.19.78.64.8q2.07.03 4.13-.02c.42 0 .65-.3.62-.74-.02-.45-.31-.63-.73-.63z"
      />
    </g>
  </>,
);

/** Usuários (menu lateral). */
export const UserIcon = createIcon(
  "69.66 252.32 18.69 21.35",
  <>
    <g fill="currentColor" transform="translate(67 251)">
      <path d="M12 22.68H4.15q-1.61 0-1.48-1.6c.35-4.16 3.43-7 7.6-7h3.58a7.4 7.4 0 0 1 7.5 7.18c.03.86-.5 1.41-1.38 1.42zm5.27-16A5.23 5.23 0 0 1 12 11.96 5.3 5.3 0 0 1 6.68 6.7a5.29 5.29 0 1 1 10.6-.01" />
    </g>
  </>,
);

/** Recolher/expandir menu; voltar. */
export const ChevronLeftIcon = createIcon(
  "329.37 56.22 8.77 15.05",
  <>
    <g transform="translate(325 55)">
      <path
        fill="currentColor"
        d="m7.41 8.68 5.01 5.12q.23.22.43.47A1.23 1.23 0 0 1 11.13 16q-.2-.16-.38-.35L5 9.91c-.85-.85-.84-1.5 0-2.35l5.68-5.68q.2-.2.42-.38a1.3 1.3 0 0 1 1.68.06c.45.45.49 1.2.02 1.72-.53.57-1.11 1.1-1.66 1.66z"
      />
    </g>
  </>,
);

/** Separador da trilha. */
export const ChevronRightIcon = createIcon(
  "427 95 12.12 12.12",
  <>
    <g fill="none">
      <path d="M439.12 95H427v12.12h12.12z" />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m431.54 98.03 3.03 3.03-3.03 3.03"
      />
    </g>
  </>,
);

/** Ação visualizar. */
export const EyeIcon = createIcon(
  "1724.58 319.79 20.85 16.42",
  <>
    <g fill="currentColor" transform="translate(1723 316)">
      <path d="M12.01 20.2a11 11 0 0 1-7.5-3.49 13 13 0 0 1-2.81-4.2c-.12-.3-.18-.73-.05-1 1.53-3.44 3.9-6.1 7.56-7.25 3.62-1.14 6.83-.12 9.61 2.34a14 14 0 0 1 3.45 4.72c.14.3.22.77.09 1.05-1.54 3.38-3.86 6-7.46 7.24-.92.31-1.92.4-2.89.6m.36-1.76c.5-.12 1.44-.23 2.3-.55 2.79-1.04 4.61-3.12 5.94-5.7.08-.15.02-.44-.07-.62a12 12 0 0 0-2.88-3.76c-2.5-2.17-5.32-2.98-8.5-1.77-2.7 1.03-4.49 3.1-5.79 5.63a.8.8 0 0 0 .07.67c.74 1.08 1.42 2.2 2.29 3.16 1.64 1.81 3.73 2.82 6.64 2.94" />
      <path d="M7.38 11.98c0-2.62 2-4.65 4.61-4.65a4.6 4.6 0 0 1 4.63 4.6 4.61 4.61 0 1 1-9.24.04m1.68-.04a2.9 2.9 0 0 0 3.05 2.98 2.9 2.9 0 0 0 2.78-3.4c-.21-1.5-1.66-2.7-2.93-2.43.1 1.73-.84 2.94-2.9 2.85" />
    </g>
  </>,
);

/** Ação editar. */
export const PencilIcon = createIcon(
  "1767.92 317 22.16 22.13",
  <>
    <g transform="translate(1767 316)">
      <path
        fill="currentColor"
        d="M18.6 1c.89 0 1.54.35 2.11.88.48.45.92.94 1.4 1.38a2.93 2.93 0 0 1 .02 4.34q-3.6 3.56-7.16 7.14l-5.9 5.88c-.58.57-1.33.88-2.1 1.1l-4.7 1.37c-.8.23-1.53-.43-1.31-1.22q.74-2.71 1.6-5.39c.18-.54.54-1.07.94-1.48q6.53-6.6 13.1-13.14a2.7 2.7 0 0 1 2-.86M3.5 20.5l.1.08c.95-.28 1.9-.59 2.87-.84q.89-.23 1.54-.9 4.58-4.63 9.19-9.24l.32-.35-.07-.14-2.42-2.44c-.2-.2-.3-.04-.43.1q-4.81 4.79-9.61 9.64c-.28.27-.45.67-.6 1.05-.18.47-.28.98-.42 1.47z"
      />
    </g>
  </>,
);

/** Ação excluir. */
export const TrashIcon = createIcon(
  "1813.43 317.05 19.15 21.9",
  <>
    <g transform="translate(1811 316)">
      <path
        fill="currentColor"
        d="m3.94 6.53-.53-.05c-.61-.1-.98-.47-.98-.99-.01-.54.37-.95 1.02-.99.68-.04 1.37-.07 2.04 0 .7.05 1.17-.16 1.5-.8.29-.55.7-1.04 1.04-1.56a2.3 2.3 0 0 1 2.01-1.07q1.96-.03 3.91 0 1.32-.01 2.07 1.1.64.93 1.24 1.89c.2.3.41.43.78.43a23 23 0 0 1 2.61.04c.8.06 1.18.85.73 1.48-.16.23-.51.34-.8.47-.14.06-.33.03-.54.04l-.3 3.91q-.36 4.98-.75 9.95c-.13 1.6-1.21 2.57-2.82 2.57H7.83c-1.66 0-2.71-1-2.83-2.68L4.02 7.05Q4 6.8 3.94 6.53M6 6.52v.57l.4 5.82.53 7.23c.04.51.27.81.82.81h8.5q.76-.01.82-.76.07-.84.12-1.69l.64-8.82q.11-1.56.2-3.16zm3.02-2.09h6.02c-.37-1.1-.73-1.36-1.78-1.36h-2.55c-.97 0-1.38.32-1.7 1.36"
      />
    </g>
  </>,
);

/** Pesquisa. */
export const SearchIcon = createIcon(
  "398 183 24 24",
  <>
    <g fill="none" transform="translate(398 183)">
      <path d="M0 0h24v24H0z" />
      <circle
        cx="7"
        cy="7"
        r="7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        transform="translate(3 3)"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m21 21-6-6"
      />
    </g>
  </>,
);

/** Cadastrar. */
export const PlusIcon = createIcon(
  "0 0 24 24",
  <path
    d="M12 3v18M3 12h18"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    fill="none"
  />,
);

/** Primeira página. */
export const PageFirstIcon = createIcon(
  "1646 1016 32 44",
  <>
    <path
      fill="none"
      d="M1651 1016h22a5 5 0 0 1 5 5v34a5 5 0 0 1-5 5h-22a5 5 0 0 1-5-5v-34a5 5 0 0 1 5-5"
    />
    <path fill="currentColor" d="m1666.25 1033.67-1.39-1.38-5.9 5.9 5.9 5.9 1.39-1.4-4.5-4.5z" />
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="2"
      d="M1655.37 1045v-14"
    />
  </>,
);

/** Página anterior. */
export const PagePrevIcon = createIcon(
  "1680 1016 32 44",
  <>
    <path
      fill="none"
      d="M1685 1016h22a5 5 0 0 1 5 5v34a5 5 0 0 1-5 5h-22a5 5 0 0 1-5-5v-34a5 5 0 0 1 5-5"
    />
    <path fill="currentColor" d="m1699.55 1033.67-1.4-1.38-5.89 5.9 5.9 5.9 1.39-1.4-4.5-4.5z" />
  </>,
);

/** Próxima página. */
export const PageNextIcon = createIcon(
  "1772 1016 32 44",
  <>
    <path
      fill="none"
      d="M1799 1060h-22a5 5 0 0 1-5-5v-34a5 5 0 0 1 5-5h22a5 5 0 0 1 5 5v34a5 5 0 0 1-5 5"
    />
    <path fill="currentColor" d="m1784.45 1042.33 1.4 1.38 5.89-5.9-5.9-5.9-1.39 1.4 4.5 4.5z" />
  </>,
);

/** Última página. */
export const PageLastIcon = createIcon(
  "1806 1016 32 44",
  <>
    <path
      fill="none"
      d="M1833 1060h-22a5 5 0 0 1-5-5v-34a5 5 0 0 1 5-5h22a5 5 0 0 1 5 5v34a5 5 0 0 1-5 5"
    />
    <path fill="currentColor" d="m1817.75 1042.33 1.39 1.38 5.9-5.9-5.9-5.9-1.39 1.4 4.5 4.5z" />
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="2"
      d="M1828.63 1031v14"
    />
  </>,
);

/** Fechar / limpar. */
export const CloseIcon = createIcon(
  "1864.21 34.6 20.79 20.79",
  <>
    <g fill="currentColor" transform="translate(1862 33)">
      <path d="M3.7 22.4a1.5 1.5 0 0 1-1.05-2.57L20.44 2.04a1.5 1.5 0 0 1 2.12 2.12l-17.8 17.8c-.29.29-.67.44-1.05.44" />
      <path d="M21.5 22.4a1.5 1.5 0 0 1-1.06-.44L2.64 4.16a1.5 1.5 0 0 1 2.13-2.12l17.79 17.8a1.5 1.5 0 0 1-1.06 2.56" />
    </g>
  </>,
);

/** Mostrar senha. */
export const PasswordShowIcon = createIcon(
  "1085 473 22 16",
  <>
    <g
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      transform="translate(1085 473)"
    >
      <path d="M0 8s4-8 11-8 11 8 11 8-4 8-11 8S0 8 0 8" />
      <circle cx="3" cy="3" r="3" transform="translate(8 5)" />
    </g>
  </>,
);

/** Ocultar senha. */
export const PasswordHideIcon = createIcon(
  "1705 515 22 22",
  <>
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M1721.94 531.94c-1.7 1.3-3.8 2.02-5.94 2.06-7 0-11-8-11-8a18.5 18.5 0 0 1 5.06-5.94m3.84-1.82q1.04-.24 2.1-.24c7 0 11 8 11 8a19 19 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1705 515l22 22"
    />
  </>,
);

/** Voltar para o login. */
export const BackCircleIcon = createIcon(
  "1318.39 617.11 23.12 23.12",
  <>
    <g fill="currentColor" transform="rotate(180 670.98 320.33)">
      <path d="M12 23.56A11.57 11.57 0 0 1 .44 12C.44 5.63 5.63.44 12 .44S23.56 5.63 23.56 12 18.37 23.56 12 23.56m0-21.12a9.57 9.57 0 0 0 0 19.12 9.57 9.57 0 0 0 0-19.12" />
      <path d="M15.42 11.08 12.66 8.3l-.3-.3c-.4-.43-.44-1.01-.07-1.38.36-.35.97-.33 1.39.08q1.23 1.21 2.45 2.44l2 2c.58.59.59 1.07.01 1.65l-4.4 4.42c-.27.26-.56.46-.95.38a.9.9 0 0 1-.71-.6.9.9 0 0 1 .25-.99l2.7-2.68.38-.41c-.28-.02-.45-.04-.63-.04H6.41c-.78 0-1.21-.7-.85-1.35.2-.37.55-.46.95-.45z" />
    </g>
  </>,
);

/** Voltar (cadastro/edição). */
export const BackIcon = createIcon(
  "387.99 129.32 12.01 21.35",
  <>
    <g transform="translate(382 128)">
      <path
        fill="currentColor"
        d="M9.21 12.1c.57.52 1.12.97 1.61 1.46l6.3 6.3q.28.25.52.55c.51.66.48 1.4-.07 1.9-.55.51-1.28.5-1.89-.1q-1.57-1.54-3.12-3.1l-5.88-5.89c-.92-.93-.92-1.5.02-2.44l8.81-8.82c.78-.77 1.53-.84 2.14-.2.54.56.47 1.38-.25 2.1l-7.37 7.38z"
      />
    </g>
  </>,
);

/** Toast de erro. */
export const ToastErrorIcon = createIcon(
  "1546.38 61.47 22.93 22.93",
  <>
    <g fill="currentColor" transform="translate(1546.17 61)">
      <path d="M11.68 2.47a9.48 9.48 0 0 1 0 18.93 9.48 9.48 0 0 1 0-18.93m0-2a11.46 11.46 0 1 0 0 22.93 11.46 11.46 0 0 0 0-22.93" />
      <path d="M10.45 17.68q-.48-.45-.48-1.1 0-.68.48-1.13.48-.46 1.24-.46.75 0 1.22.46.48.45.48 1.13 0 .66-.48 1.1t-1.22.45-1.24-.45M13.2 5.74l-.34 8.07h-2.45l-.33-8.07z" />
    </g>
  </>,
);

/** Toast de sucesso. */
export const ToastSuccessIcon = createIcon(
  "1891.33 65.12 21.35 15.76",
  <>
    <g transform="translate(1890 61)">
      <path
        fill="currentColor"
        d="M9.74 19.88a1.5 1.5 0 0 1-1.01-.4L1.8 13.12a1.5 1.5 0 1 1 2.03-2.21l5.8 5.34L20.06 4.62a1.5 1.5 0 1 1 2.23 2L10.86 19.38a1.5 1.5 0 0 1-1.12.5"
      />
    </g>
  </>,
);

/** Toast de aviso. */
export const ToastWarningIcon = createIcon(
  "1607.53 106.99 22.95 20.17",
  <>
    <g fill="currentColor" transform="translate(1607 105)">
      <path d="m12 4.89 4.4 7.63 4.41 7.63H3.2l4.4-7.63zm0-2.9c-.37 0-.74.18-.95.55l-5.19 8.98L.67 20.5a1.1 1.1 0 0 0 .96 1.65h20.74c.85 0 1.38-.91.96-1.65l-5.2-8.98-5.18-8.98a1.1 1.1 0 0 0-.95-.55" />
      <path d="M13.17 9.14h-2.4l.27 6.2h1.87zm-1.16 7.1q-.59 0-.95.35-.37.36-.37.87 0 .5.37.85.36.34.95.34.57 0 .93-.34t.37-.85-.37-.87a1.3 1.3 0 0 0-.93-.34" />
    </g>
  </>,
);

/** Fechar toast. */
export const ToastCloseIcon = createIcon(
  "1876.21 62.6 20.79 20.79",
  <>
    <g fill="currentColor" transform="translate(1874 61)">
      <path d="M3.7 22.4a1.5 1.5 0 0 1-1.05-2.57L20.44 2.04a1.5 1.5 0 0 1 2.12 2.12l-17.8 17.8c-.29.29-.67.44-1.05.44" />
      <path d="M21.5 22.4a1.5 1.5 0 0 1-1.06-.44L2.64 4.16a1.5 1.5 0 0 1 2.13-2.12l17.79 17.8a1.5 1.5 0 0 1-1.06 2.56" />
    </g>
  </>,
);

/** Sair. */
export const LogoutIcon = createIcon(
  "7.35 9.68 21.29 18.64",
  <>
    <path d="M14.07 19v-1.33c.03-1.16.79-1.92 1.96-1.94q1.66-.03 3.33 0c.52.03.77-.1.7-.66q-.04-.39-.01-.79c.03-.82.42-1.44 1.19-1.74a1.8 1.8 0 0 1 2.06.44l4.68 4.66c.87.87.9 1.84.03 2.7q-2.37 2.4-4.78 4.74-.79.78-1.83.46a1.8 1.8 0 0 1-1.3-1.46q-.07-.35-.05-.72c-.03-1.24.18-1.06-1.11-1.08h-2.85c-1.27-.02-2-.78-2.02-2.06zm7.85 4.52 4.46-4.43-4.42-4.43-.03 1.69c-.01 1.01-.27 1.27-1.3 1.27h-3.94l-.74.04c0 .69.03 1.31-.01 1.93-.05.6.1.82.75.8 1.3-.06 2.62-.03 3.93-.02 1.03 0 1.3.27 1.3 1.28z" />
    <path d="M7.36 18.97v-5.45c0-2.12 1.4-3.67 3.51-3.8 1.11-.07 2.23-.04 3.34 0 .88.03 1.35.7.93 1.36-.16.27-.6.48-.92.5-.97.07-1.94.03-2.91.03q-2.05 0-2.04 2.06v10.66c0 1.42.66 2.07 2.1 2.07h2.96c.56.02.94.4.95.91.02.47-.33.95-.83.96-1.33.03-2.68.12-3.99-.05-1.88-.23-3.1-1.77-3.1-3.67z" />
  </>,
);

/** Confirmação do modal. */
export const CheckCircleIcon = createIcon(
  "914 467 91 91",
  <>
    <path
      fill="currentColor"
      d="M954.14 530.99c-.89 0-1.75-.34-2.4-.94l-16.44-15.12a3.56 3.56 0 1 1 4.82-5.24l13.78 12.67 24.73-27.6a3.56 3.56 0 1 1 5.3 4.75l-27.13 30.3a3.6 3.6 0 0 1-2.66 1.18"
    />
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      d="M959.5 469a43.5 43.5 0 1 1 0 87 43.5 43.5 0 0 1 0-87Z"
    />
  </>,
);

/** Triângulo do grupo expansível do menu lateral ("Controle de Acesso ▾"). */
export const CaretDownIcon = createIcon("0 0 10 6", <path fill="currentColor" d="M0 0h10L5 6z" />);

/** Chevron do selo do avatar (aponta para baixo; gire 180° quando aberto). */
export const ChevronDownSmallIcon = createIcon(
  "0 0 9 5",
  <path
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="1.3"
    d="m1 1 3.5 3L8 1"
  />,
);
