const base = import.meta.env.BASE_URL;

// Official AndesNova isotype (design and logo/logo, "Logo 4 · Isotipo").
export function LogoMark({ size = 46 }: { size?: number }) {
  return (
    <img
      className="logo-mark"
      src={`${base}logo-mark.png`}
      srcSet={`${base}logo-mark.png 1x, ${base}logo-mark@2x.png 2x`}
      width={size}
      height={Math.round(size * 0.555)}
      alt=""
      aria-hidden="true"
    />
  );
}

// Compact version ("Logo 3"), recommended for headers and navigation.
export function Logo() {
  return (
    <span className="logo">
      <LogoMark size={58} />
      <span className="logo-text">
        <strong>
          Andes<span>Nova</span>
        </strong>
      </span>
    </span>
  );
}
