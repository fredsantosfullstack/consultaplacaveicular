import React from 'react';

interface Statistic {
  number: string;
  label: string;
}

interface StatisticsProps {
  statistics: Statistic[];
}

const Statistics: React.FC<StatisticsProps> = ({ statistics }) => {
  return (
    <section className="py-14 bg-slate-900 text-white">
      <div className="max-w-[1410px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {statistics.map((stat, index) => (
            <div key={index}>
              <p className="text-sm uppercase tracking-[0.3em] text-white/60">
                {stat.label}
              </p>
              <p className="text-4xl sm:text-5xl font-black tracking-tight mt-2">
                {stat.number}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;
