const MetricCard = ({ title, value, color = "text-champagne", icon: Icon }) => {
    return (
        <div className="glass p-6 flex items-center justify-between">
            <div>
                <p className="text-gray-600 text-sm uppercase tracking-wider mb-1">{title}</p>
                <p className={`text-3xl font-bold ${color}`}>{value}</p>
            </div>
            {Icon && <Icon className={`opacity-20 ${color}`} size={48} />}
        </div>
    );
};

export default MetricCard;
