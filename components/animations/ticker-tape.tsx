type TickerItem = {
  symbol: string;
  price: string;
  change: string;
  direction: "up" | "down";
};

const items: TickerItem[] = [
  { symbol: "AAPL", price: "224.16", change: "+0.84%", direction: "up" },
  { symbol: "TSLA", price: "248.94", change: "-1.32%", direction: "down" },
  { symbol: "EUR/USD", price: "1.0864", change: "+0.17%", direction: "up" },
  { symbol: "BTC", price: "67,412", change: "-0.56%", direction: "down" },
  { symbol: "ETH", price: "3,528", change: "+1.08%", direction: "up" },
  { symbol: "NIFTY", price: "24,812", change: "+0.41%", direction: "up" },
  { symbol: "GOLD", price: "2,664", change: "-0.23%", direction: "down" },
];

function TickerGroup({ hidden }: { hidden: boolean }) {
  return (
    <div className="flex shrink-0 items-center" aria-hidden={hidden}>
      {items.map((item) => (
        <div
          key={item.symbol}
          className="flex shrink-0 items-center gap-2 border-r border-white/10 px-5 text-xs"
        >
          <span className="font-semibold tracking-wide text-white">
            {item.symbol}
          </span>
          <span className="tabular-nums text-white/60">{item.price}</span>
          <span
            className={
              item.direction === "up"
                ? "font-medium tabular-nums text-teal-300"
                : "font-medium tabular-nums text-red-400"
            }
          >
            {item.change}
          </span>
        </div>
      ))}
    </div>
  );
}

export function TickerTape() {
  return (
    <div className="border-b border-white/10 bg-navy-950 text-white">
      <div className="mx-auto flex h-9 max-w-7xl items-center">
        <div className="z-10 flex h-full shrink-0 items-center gap-2 border-r border-white/10 bg-navy-950 px-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/70 sm:px-6">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-teal-400" />
          <span className="text-[9px] sm:text-[10px]">Illustrative data</span>
        </div>
        <div className="ticker-viewport relative flex-1 overflow-hidden">
          <div className="ticker-track flex w-max">
            <TickerGroup hidden={false} />
            <TickerGroup hidden />
          </div>
        </div>
      </div>
    </div>
  );
}
