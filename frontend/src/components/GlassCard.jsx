import { motion } from 'framer-motion';

const GlassCard = ({ children, className = "" }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={`glass p-8 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 ${className}`}
        >
            {children}
        </motion.div>
    );
};

export default GlassCard;
