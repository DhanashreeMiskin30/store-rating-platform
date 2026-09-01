export default function StarRating({ value = 0, onChange, readonly = false, size }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <span className={`star-rating${readonly ? ' readonly' : ''}`} style={size ? { fontSize: size } : undefined}>
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          className={star <= value ? 'filled' : ''}
          disabled={readonly}
          aria-label={`${star} star`}
          onClick={() => onChange && onChange(star)}
        >
          ★
        </button>
      ))}
    </span>
  );
}
