import { useEffect, useState, useRef } from "react";
import Chart from "chart.js/auto";
import { useSessionStore } from "../store/sessionStore.js";
import { privateApi } from "../api/privateApi.js";
import { useAuthStore } from "../store/authStore.js";

export default function MLSidebar() {

    const [isOpen, setIsOpen] = useState(false);
    const [prob, setProb] = useState(0);

    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    const anonymousId = localStorage.getItem("anonymousId");
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn)

    useEffect(() => {

        if(!chartRef.current) return;
        
        chartInstance.current = new Chart(chartRef.current, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: ' Purchase Probability',
                    data: [],
                    borderWidth: 2,
                    pointRadius: 4,
                    tension: 0.4,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        suggestedMax: 0.2,
                        grid: {
                            color: '#eee'
                        }
                    },
                    x: {
                        grid: {
                            color: '#eee'
                        },
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45,
                            align: 'start',
                            autoSkip: false,
                            callback: function(value) {
                                return this.getLabelForValue(value);
                            }
                        }
                    }
                }
            }
        });

        return () => {
            chartInstance.current.destroy();
        };
    }, []);

    //Polling 
    useEffect(() => {
        if (!isLoggedIn && !anonymousId) return;

        const interval = setInterval(async () => {

        const url = isLoggedIn ?   
            `/analysis/me` : 
            `/analysis/anonymous/${anonymousId}`

            try {
                const { data } = await privateApi.get(url);
                updateChart(data);

            } catch (error) {
                console.error("Error fetching analysis data:", error);
            }
        }, 3000); // Poll every 5 seconds

        return () => clearInterval(interval);

    }, [anonymousId, isLoggedIn]);

    const humanizeEventLabel = (eventType, index) => {
        const rawLabel = eventType || `Event ${index + 1}`;
        return rawLabel
            .toString()
            .replace(/_/g, ' ')
            .toLowerCase()
            .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    const updateChart = (data) => {

        if (!chartInstance.current) return;

        const probsRaw = data.events.map(e => e.prediction);
        // 👉 opcional: escala visual (para demo)
        const probs = probsRaw.map(p => p *1.5); // o p * 10 si querés amplificar

        const labels = data.events.map((e, i) => humanizeEventLabel(e.eventType || e.event_type || e.type, i));
        
        if (probs.length < 2) {
            chartInstance.current.data.labels = ["Start"];
            chartInstance.current.data.datasets[0].data = [0];
        } else {
            chartInstance.current.data.labels = labels;
            chartInstance.current.data.datasets[0].data = probs;
        }

        const maxProb = Math.max(...probs, 0.05);
        chartInstance.current.options.scales.y.max = maxProb * 1.2;

        chartInstance.current.update();

        const lastProb = probs[probs.length - 1] || 0;
        if (probs.length >= 2) {
            setProb(lastProb);
        }
    };

    const getIntentLabel = () => {
        if (prob > 0.7) return { text: "🔥 High Intent", color: "red" };
        if (prob > 0.4) return { text: "⚡ Medium Intent", color: "orange" };
        return { text: "❄️ Low Intent", color: "gray" };
    }

    const intent = getIntentLabel()

    let bgColor = '#f0f0f0'; // default gray
    if (prob > 0.4) bgColor = '#d4edda'; // light green
    else if (prob > 0.2) bgColor = '#fff3cd'; // light yellow
    else bgColor = '#f8d7da'; // light red

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: "fixed",
                    right: "20px",
                    bottom: "20px",
                    zIndex: 1000,
                    padding: "10px 15px",
                    borderRadius: "8px",
                    border: "none",
                    background: "#333",
                    color: "white",
                    cursor: "pointer"
                }}
            >
                {isOpen ? "Close ML" : "Open ML"}
            </button>
            {/* <div style={{
                position: "fixed",
                top: "80px",
                right: "20px",
                background: bgColor,
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "10px 15px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                zIndex: 1001,
                fontSize: "14px",
                fontWeight: "bold"
            }}>
                Purchase Probability: {prob.toFixed(2)}
            </div> */}
            <div style={{
                position: "fixed",
                right: isOpen ? "0" : "-550px",
                top: 0,
                width: "550px",
                height: "100vh",
                background: "#fafafa",
                borderLeft: "1px solid #ddd",
                padding: "20px",
                transition: "right 0.3s ease",
                zIndex: 999
            }}
            >
                <h3>Purchase Intent</h3>

                <h2>{prob.toFixed(2)}</h2>

                <p style={{ color: intent.color }}>
                    {intent.text}
                </p>
                <div style={{width: "100%", height: "500px"}}>
                    <canvas ref={chartRef} />
                </div>
            </div>
        </>
    )
}