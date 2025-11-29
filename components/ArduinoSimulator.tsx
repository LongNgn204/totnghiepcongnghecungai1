import React, { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw, Pause, StepForward } from 'lucide-react';

interface LEDState {
  pin: number;
  color: string; // hex color
  isOn: boolean; // digital on/off
  intensity: number; // 0..1 for PWM brightness
  label: string;
}

type Command =
  | { time: number; type: 'digital'; pin: number; state: boolean }
  | { time: number; type: 'pwm'; pin: number; value: number };

interface ArduinoSimulatorProps {
  code: string;
  onSimulationOutput?: (output: string) => void;
  simulateSignal?: number;
}

const ArduinoSimulator: React.FC<ArduinoSimulatorProps> = ({ code, onSimulationOutput, simulateSignal }) => {
  const intervalRef = useRef<number | null>(null);
  const [commands, setCommands] = useState<Command[]>([]);
  const [duration, setDuration] = useState<number>(10000);
  const [leds, setLeds] = useState<LEDState[]>([
    { pin: 8, color: '#ef4444', isOn: false, intensity: 0, label: 'RED (Pin 8)' },
    { pin: 9, color: '#eab308', isOn: false, intensity: 0, label: 'YELLOW (Pin 9)' },
    { pin: 10, color: '#22c55e', isOn: false, intensity: 0, label: 'GREEN (Pin 10)' },
    { pin: 13, color: '#3b82f6', isOn: false, intensity: 0, label: 'LED (Pin 13)' }
  ]);
  const ledsRef = useRef<LEDState[]>([]);
  useEffect(()=>{ ledsRef.current = leds; }, [leds]);

  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string>('');
  const [simulationTime, setSimulationTime] = useState(0);

  // Parse commands whenever code changes to build timeline
  useEffect(() => {
    const cmds = parseArduinoCode(code);
    setCommands(cmds);
    const last = cmds.length ? Math.max(...cmds.map(c => c.time)) : 0;
    setDuration(Math.max(10000, last + 1000));
    // Reset LEDs to t=0 state
    const init = applyStateAtTime(0, cmds, leds);
    setLeds(init.map(l => ({ ...l, isOn: false, intensity: 0 })));
    setSimulationTime(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  // Parse Arduino code with pin alias support and PWM
  const parseArduinoCode = (arduinoCode: string): Command[] => {
    const lines = arduinoCode.split('\n');
    const commands: Command[] = [];
    const pinAlias: Record<string, number> = {};
    let currentTime = 0;

    for (const raw of lines) {
      const line = raw.trim();
      if (!line || line.startsWith('//')) continue;

      // const int NAME = 13;
      const aliasMatch = line.match(/const\s+int\s+(\w+)\s*=\s*(\d+)\s*;/);
      if (aliasMatch) {
        pinAlias[aliasMatch[1]] = parseInt(aliasMatch[2]);
        continue;
      }

      // delay(ms)
      const delayMatch = line.match(/delay\s*\(\s*(\d+)\s*\)/);
      if (delayMatch) {
        currentTime += parseInt(delayMatch[1]);
        continue;
      }

      // digitalWrite(pinExpr, HIGH|LOW)
      const dwMatch = line.match(/digitalWrite\s*\(\s*(\w+)\s*,\s*(HIGH|LOW)\s*\)/);
      if (dwMatch) {
        const pinExpr = dwMatch[1];
        const pin = /^(\d+)$/.test(pinExpr) ? parseInt(pinExpr) : (pinAlias[pinExpr] ?? NaN);
        if (!isNaN(pin)) {
          const state = dwMatch[2] === 'HIGH';
          commands.push({ time: currentTime, type: 'digital', pin, state });
        }
        continue;
      }

      // analogWrite(pinExpr, value)
      const awMatch = line.match(/analogWrite\s*\(\s*(\w+)\s*,\s*(\d+)\s*\)/);
      if (awMatch) {
        const pinExpr = awMatch[1];
        const pin = /^(\d+)$/.test(pinExpr) ? parseInt(pinExpr) : (pinAlias[pinExpr] ?? NaN);
        const value = Math.max(0, Math.min(255, parseInt(awMatch[2])));
        if (!isNaN(pin)) {
          commands.push({ time: currentTime, type: 'pwm', pin, value });
        }
        continue;
      }
    }

    return commands;
  };

  const applyStateAtTime = (time: number, commands: Command[], prevLeds: LEDState[]) => {
    const updated = prevLeds.map(led => {
      const relevant = commands.filter(c => c.pin === led.pin && c.time <= time);
      if (relevant.length === 0) return led;
      const last = relevant[relevant.length - 1];
      if (last.type === 'digital') {
        return { ...led, isOn: last.state, intensity: last.state ? 1 : 0 };
      } else {
        const intensity = last.value / 255;
        return { ...led, isOn: last.value > 0, intensity };
      }
    });
    return updated;
  };

  const simulateCode = () => {
    // Reset output and play from 0
    pause();
    setOutput('Simulation started...\n');
    setSimulationTime(0);
    setLeds(leds.map(led => ({ ...led, isOn: false, intensity: 0 })));
    play();
  };

  const play = () => {
    if (intervalRef.current !== null) return; // already playing
    setIsRunning(true);
    let outputText = output || '';
    intervalRef.current = window.setInterval(() => {
      setSimulationTime(prev => {
        const newTime = Math.min(prev + 100, duration);
        const newLeds = applyStateAtTime(newTime, commands, ledsRef.current);
        // Log significant changes
        newLeds.forEach((led, idx) => {
          const before = ledsRef.current[idx];
          const changedDigital = before.isOn !== led.isOn;
          const changedPWM = Math.abs(before.intensity - led.intensity) > 0.05;
          if (changedDigital) {
            const action = led.isOn ? 'ON' : 'OFF';
            outputText += `[${(newTime / 1000).toFixed(1)}s] ${led.label} turned ${action}\n`;
          } else if (changedPWM) {
            outputText += `[${(newTime / 1000).toFixed(1)}s] ${led.label} PWM ${(led.intensity*100).toFixed(0)}%\n`;
          }
        });
        setLeds(newLeds);
        setOutput(outputText);
        onSimulationOutput?.(outputText);
        if (newTime >= duration) {
          pause();
          setIsRunning(false);
          outputText += '\nSimulation completed!';
          setOutput(outputText);
          onSimulationOutput?.(outputText);
        }
        return newTime;
      });
    }, 100);
  };

  const pause = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  };

  const step = () => {
    pause();
    setSimulationTime(prev => {
      const newTime = Math.min(prev + 100, duration);
      const newLeds = applyStateAtTime(newTime, commands, leds);
      setLeds(newLeds);
      return newTime;
    });
  };

  // scrub timeline
  const scrubTo = (ms: number) => {
    pause();
    const t = Math.max(0, Math.min(duration, ms));
    setSimulationTime(t);
    const newLeds = applyStateAtTime(t, commands, leds);
    setLeds(newLeds);
  };

  // Cleanup interval on unmount
  useEffect(() => {
    return () => pause();
  }, []);


  useEffect(() => {
    if (simulateSignal && simulateSignal > 0) {
      simulateCode();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simulateSignal]);

  const resetSimulation = () => {
    setIsRunning(false);
    setSimulationTime(0);
    setOutput('');
    setLeds(leds.map(led => ({ ...led, isOn: false })));
  };

  return (
    <div className="flex flex-col h-full gap-4 p-4 bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">Arduino Uno Simulator</h3>
        <div className="text-sm text-gray-500">
          Time: <span className="font-mono font-bold">{(simulationTime / 1000).toFixed(1)}s</span>
        </div>
      </div>

      {/* Arduino Board Visualization */}
      <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-6 border-2 border-gray-300">
        {/* Arduino Board SVG */}
        <svg viewBox="0 0 300 200" className="w-full max-w-xs mb-6">
          {/* Board */}
          <rect x="20" y="20" width="260" height="160" fill="#1a472a" stroke="#0d2818" strokeWidth="2" rx="8" />

          {/* USB Port */}
          <rect x="130" y="10" width="40" height="15" fill="#333" stroke="#000" strokeWidth="1" rx="2" />
          <text x="150" y="20" textAnchor="middle" fontSize="8" fill="#fff" fontWeight="bold">
            USB
          </text>

          {/* Power Indicator */}
          <circle cx="40" cy="40" r="4" fill={isRunning ? '#00ff00' : '#666'} />
          <text x="50" y="45" fontSize="10" fill="#fff" fontWeight="bold">
            PWR
          </text>

          {/* LED Indicators */}
          {leds.map((led, idx) => {
            const x = 60 + idx * 50;
            const y = 80;
            const isActive = led.isOn;

            return (
              <g key={led.pin}>
                {/* LED Circle */}
                <circle
                  cx={x}
                  cy={y}
                  r="12"
                  fill={isActive ? led.color : '#333'}
                  stroke="#000"
                  strokeWidth="1"
                  opacity={isActive ? Math.max(0.25, led.intensity) : 0.4}
                  style={{ filter: isActive ? `drop-shadow(0 0 ${4 + Math.round(8*led.intensity)}px ${led.color})` : 'none' }}
                />

                {/* LED Label */}
                <text x={x} y={y + 30} textAnchor="middle" fontSize="9" fill="#fff" fontWeight="bold">
                  {led.label.split('(')[0].trim()}
                </text>

                {/* Pin Number */}
                <text x={x} y={y + 45} textAnchor="middle" fontSize="8" fill="#aaa">
                  Pin {led.pin}
                </text>
              </g>
            );
          })}

          {/* Board Label */}
          <text x="150" y="160" textAnchor="middle" fontSize="12" fill="#fff" fontWeight="bold">
            Arduino Uno
          </text>
        </svg>

        {/* LED Status Grid */}
        <div className="grid grid-cols-2 gap-3 w-full">
          {leds.map(led => (
            <div
              key={led.pin}
              className="p-3 rounded-lg border-2 transition-all"
              style={{
                borderColor: led.isOn ? led.color : '#D1D5DB',
                backgroundColor: led.isOn ? `${led.color}20` : '#F9FAFB'
              }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full transition-all"
                  style={{
                    backgroundColor: led.isOn ? led.color : '#D1D5DB',
                    boxShadow: led.isOn ? `0 0 10px ${led.color}` : 'none'
                  }}
                />
                <div className="text-sm font-medium text-gray-900">{led.label}</div>
              </div>
              <div className="text-xs text-gray-600 mt-1">
                Status: <span className="font-bold">{led.isOn ? 'ON' : 'OFF'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Output Console */}
      <div className="bg-gray-900 text-green-400 font-mono text-xs p-3 rounded-lg h-32 overflow-y-auto border border-gray-700">
        <pre className="whitespace-pre-wrap break-words">{output || 'Output will appear here...'}</pre>
      </div>

      {/* Timeline Controls */}
      <div className="p-3 bg-white border rounded-lg">
        <div className="flex items-center justify-between mb-2 text-xs text-gray-600">
          <span>Thời gian: {(simulationTime/1000).toFixed(1)}s</span>
          <span>Tổng: {(duration/1000).toFixed(1)}s</span>
        </div>
        {/* Marker track */}
        <div className="relative h-2 bg-gray-100 rounded mb-2 overflow-hidden">
          {/* Progress indicator */}
          <div className="absolute left-0 top-0 h-2 bg-blue-300" style={{ width: `${(simulationTime/duration)*100}%` }} />
          {/* Markers */}
          {commands.map((c, idx) => (
            <div key={idx} className="absolute top-0 h-2" style={{ left: `${(c.time/duration)*100}%` }}>
              <div className={`w-0.5 h-2 ${c.type==='digital' ? 'bg-blue-600' : 'bg-amber-500'}`}></div>
            </div>
          ))}
        </div>
        <input
          type="range"
          min={0}
          max={duration}
          step={100}
          value={simulationTime}
          onChange={(e) => scrubTo(parseInt(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Control Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={simulateCode}
          disabled={isRunning}
          className="flex-1 min-w-[120px] flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          <Play size={16} />
          Play
        </button>
        <button
          onClick={pause}
          className="flex-1 min-w-[120px] flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          <Pause size={16} />
          Pause
        </button>
        <button
          onClick={step}
          className="flex-1 min-w-[120px] flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          <StepForward size={16} />
          Step +100ms
        </button>
        <button
          onClick={resetSimulation}
          className="flex-1 min-w-[120px] flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>
    </div>
  );
};

export default ArduinoSimulator;

