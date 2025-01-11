import cx from "classnames";

type Props = {
  label: string;
  value: string;
  className?: string;
};

export default function DataAndLabel({ label, value, className }: Props) {
  return (
    <div className={cx("label-data-pair", className)}>
      <p aria-hidden className="label">
        {label}
      </p>
      <p aria-label={label} className="data">
        {value}
      </p>
    </div>
  );
}
