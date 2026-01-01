const MetricCard = ({ title, value, color = "text-yellow-600", icon: Icon }) => {
    return (
        <div className="bg-white p-6 flex items-center justify-between border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">{title}</p>
                <p className={`text-3xl font-bold ${color}`}>{value}</p>
            </div>
            {Icon && <Icon className={`opacity-80 ${color}`} size={32} />}
        </div>
    );
};

export default MetricCard;
