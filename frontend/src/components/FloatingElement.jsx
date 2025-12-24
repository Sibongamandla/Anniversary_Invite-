import { motion } from 'framer-motion';

const FloatingElement = ({ children, delay = 0, duration = 3 }) => {
    return (
        <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{
                duration: duration,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: delay,
            }}
        >
            {children}
        </motion.div>
    );
};

export default FloatingElement;
