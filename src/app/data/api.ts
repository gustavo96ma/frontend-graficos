export const fetchData = async () => {
    // Simulando uma chamada assíncrona ao backend
    return [
        // Para facilitar, vamos gerar dinamicamente os registros
        ...Array.from({ length: 30 }, (_, index) => {
            const minutes = (index + 6) * 5; // Incremento de 5 minutos
            const date = new Date('2024-05-09T10:00:00');
            date.setMinutes(date.getMinutes() + minutes);
            const formattedDate = date
                .toISOString()
                .replace('T', '-')
                .substring(0, 19);
            const statuses = ['success', 'error'];
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            const delays = [30, 80, 180, 200, 220, 250, 300, 350, 400, 550, 700];
            const delay = `${delays[Math.floor(Math.random() * delays.length)]}ms`;
            const errors = [null, 'Timeout', 'Connection lost', 'Server error'];
            return {
                createdAt: formattedDate,
                status,
                delay,
                error: status === 'error' ? errors[Math.floor(Math.random() * errors.length)] : null,
                name: 'BBConsulta',
            };
        }),
    ];
};
