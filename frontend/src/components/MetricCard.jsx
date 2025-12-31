const MetricCard = ({ title, value, color = "text-champagne", icon: Icon }) => {
    return (
        <div className="glass p-6 flex items-center justify-between border border-white/10 bg-black/40 rounded-lg">
            <div>
                <p className="text-white/60 text-xs uppercase tracking-wider mb-1">{title}</p>
                <p className={`text-3xl font-bold ${color}`}>{value}</p>
            </div>
            {Icon && <Icon className={`opacity-80 ${color}`} size={32} />}
        </div>
    );
};

export default MetricCard;
