export default function Loader({ hidden }) {
  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center gap-8 z-[9999] transition-[opacity,visibility] duration-400 ${hidden ? 'opacity-0 invisible pointer-events-none' : 'opacity-100 visible'}`}
      style={{ background: '#ffd93d' }}
    >
      {/* Letters */}
      <div className="flex gap-6">
        {['Z', 'L'].map((letter, i) => (
          <div
            key={letter}
            className="loader-letter w-[110px] h-[110px] flex items-center justify-center text-[5rem] font-bold border-4 text-black"
            style={{
              borderColor: '#000',
              boxShadow: '8px 8px 0 #000',
              background: i === 0 ? '#66d9ef' : '#ff6b9d',
            }}
          >
            {letter}
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div
        className="w-[280px] h-[18px] border-[3px] overflow-hidden"
        style={{
          background: '#fff',
          borderColor: '#000',
          boxShadow: '5px 5px 0 #000',
        }}
      >
        <div className="loader-bar-fill" />
      </div>
    </div>
  );
}
