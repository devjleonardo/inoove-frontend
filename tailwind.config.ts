import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			askia: {
  				yellow: '#FFDE14',
  				'yellow-light': '#FFEA5F',
  				'yellow-dark': '#E6C800'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		animation: {
  			'gradient-x': 'gradient-x 3s ease infinite',
  			'gradient-xy': 'gradient-xy 3s ease infinite',
  			'gradient-xy-reverse': 'gradient-xy-reverse 3s ease infinite',
  			'gradient-rotate': 'gradient-rotate 4s linear infinite',
  			'gradient-pulse': 'gradient-pulse 3s ease-in-out infinite',
  			'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  			'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
  			'ping-slow': 'ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite',
  			'spin-slow': 'spin 8s linear infinite',
  			'spin-slow-reverse': 'spin 10s linear infinite reverse',
  			'spin-medium': 'spin 6s linear infinite',
  			'spin-medium-reverse': 'spin 7s linear infinite reverse',
  			'spin-fast': 'spin 5s linear infinite',
  			'spin-fast-reverse': 'spin 9s linear infinite reverse',
  			'spin-extra-slow': 'spin 12s linear infinite',
  			'float': 'float 6s ease-in-out infinite',
  			'shimmer': 'shimmer 2s linear infinite',
  			'glow': 'glow 4s ease-in-out infinite',
  			'bounce-slow': 'bounce-slow 3s ease-in-out infinite',
  			'swing': 'swing 2s ease-in-out infinite',
  			'wobble': 'wobble 4s ease-in-out infinite',
  			'rotate-3d': 'rotate-3d 5s linear infinite',
  			'scale-pulse': 'scale-pulse 2.5s ease-in-out infinite',
  			'flip': 'flip 6s ease-in-out infinite',
  			'shake': 'shake 3s ease-in-out infinite',
  		},
  		keyframes: {
  			'gradient-x': {
  				'0%, 100%': {
  					'background-position': '0% 50%',
  				},
  				'50%': {
  					'background-position': '100% 50%',
  				},
  			},
  			'gradient-xy': {
  				'0%, 100%': {
  					'background-position': '0% 50%',
  				},
  				'50%': {
  					'background-position': '100% 50%',
  				},
  			},
  			'gradient-xy-reverse': {
  				'0%, 100%': {
  					'background-position': '100% 50%',
  				},
  				'50%': {
  					'background-position': '0% 50%',
  				},
  			},
  			'gradient-rotate': {
  				'0%': {
  					'background-position': '0% 50%',
  				},
  				'50%': {
  					'background-position': '100% 50%',
  				},
  				'100%': {
  					'background-position': '0% 50%',
  				},
  			},
  			'gradient-pulse': {
  				'0%, 100%': {
  					opacity: '0.6',
  					'background-position': '0% 50%',
  				},
  				'50%': {
  					opacity: '1',
  					'background-position': '100% 50%',
  				},
  			},
  			'float': {
  				'0%, 100%': {
  					transform: 'translate(0px, 0px) scale(1)',
  					opacity: '0.3',
  				},
  				'33%': {
  					transform: 'translate(10px, -15px) scale(1.2)',
  					opacity: '0.6',
  				},
  				'66%': {
  					transform: 'translate(-10px, -25px) scale(0.9)',
  					opacity: '0.4',
  				},
  			},
  			'shimmer': {
  				'0%': {
  					transform: 'translateX(-100%)',
  				},
  				'100%': {
  					transform: 'translateX(100%)',
  				},
  			},
  			'pulse-soft': {
  				'0%, 100%': {
  					opacity: '1',
  				},
  				'50%': {
  					opacity: '0.7',
  				},
  			},
  			'ping-slow': {
  				'0%': {
  					transform: 'scale(1)',
  					opacity: '0.6',
  				},
  				'50%': {
  					transform: 'scale(1.2)',
  					opacity: '0',
  				},
  				'100%': {
  					transform: 'scale(1)',
  					opacity: '0',
  				},
  			},
  			'glow': {
  				'0%, 100%': {
  					opacity: '0.3',
  					'background-position': '0% 50%',
  				},
  				'50%': {
  					opacity: '0.5',
  					'background-position': '100% 50%',
  				},
  			},
  			'bounce-slow': {
  				'0%, 100%': {
  					transform: 'translateY(0) scale(1)',
  				},
  				'50%': {
  					transform: 'translateY(-15px) scale(1.05)',
  				},
  			},
  			'swing': {
  				'0%, 100%': {
  					transform: 'rotate(0deg)',
  				},
  				'25%': {
  					transform: 'rotate(10deg)',
  				},
  				'75%': {
  					transform: 'rotate(-10deg)',
  				},
  			},
  			'wobble': {
  				'0%, 100%': {
  					transform: 'rotate(0deg) scale(1)',
  				},
  				'25%': {
  					transform: 'rotate(5deg) scale(1.1)',
  				},
  				'50%': {
  					transform: 'rotate(0deg) scale(0.95)',
  				},
  				'75%': {
  					transform: 'rotate(-5deg) scale(1.1)',
  				},
  			},
  			'rotate-3d': {
  				'0%': {
  					transform: 'perspective(400px) rotateY(0deg)',
  				},
  				'100%': {
  					transform: 'perspective(400px) rotateY(360deg)',
  				},
  			},
  			'scale-pulse': {
  				'0%, 100%': {
  					transform: 'scale(1)',
  				},
  				'50%': {
  					transform: 'scale(1.15)',
  				},
  			},
  			'flip': {
  				'0%, 100%': {
  					transform: 'rotateY(0deg)',
  				},
  				'50%': {
  					transform: 'rotateY(180deg)',
  				},
  			},
  			'shake': {
  				'0%, 100%': {
  					transform: 'translateX(0)',
  				},
  				'25%': {
  					transform: 'translateX(-5px)',
  				},
  				'75%': {
  					transform: 'translateX(5px)',
  				},
  			},
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
