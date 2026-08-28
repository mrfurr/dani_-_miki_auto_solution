import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DiagnosticDTC, DiagnosticSensor } from '../types';
import { INITIAL_DIAGNOSTIC_CODES, INITIAL_LIVE_SENSORS } from '../data/initialData';
import { sounds } from '../utils/audio';
import { 
  Activity, 
  Cpu, 
  Terminal, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Radio, 
  Zap, 
  Sliders, 
  Gauge,
  Layers
} from 'lucide-react';

interface DiagnosticScannerHUDProps {
  onOpenBookingForDiagnosis: () => void;
}

export const DiagnosticScannerHUD: React.FC<DiagnosticScannerHUDProps> = ({
  onOpenBookingForDiagnosis,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(100);
  const [activeTab, setActiveTab] = useState<'dtc' | 'live_sensors' | 'ecu_hex'>('dtc');
  const [codes, setCodes] = useState<DiagnosticDTC[]>(INITIAL_DIAGNOSTIC_CODES);
  const [sensors, setSensors] = useState<DiagnosticSensor[]>(INITIAL_LIVE_SENSORS);
  const [selectedDtc, setSelectedDtc] = useState<DiagnosticDTC | null>(INITIAL_DIAGNOSTIC_CODES[0]);
  const [selectedVehicle, setSelectedVehicle] = useState('BMW G30 530i (B48 DME 8.4)');

  // Dynamic live sensor micro-fluctuation to give real-time telemetry feeling
  useEffect(() => {
    const interval = setInterval(() => {
      setSensors((prev) =>
        prev.map((s) => {
          let delta = 0;
          if (s.id === 'rpm') delta = (Math.random() - 0.5) * 30;
          else if (s.id === 'boost') delta = (Math.random() - 0.5) * 0.05;
          else if (s.id === 'rail') delta = (Math.random() - 0.5) * 15;
          else if (s.id === 'lambda') delta = (Math.random() - 0.5) * 0.006;
          else delta = (Math.random() - 0.5) * 0.2;

          const newVal = Math.max(s.min, Math.min(s.max, Number((s.value + delta).toFixed(s.unit === 'λ' ? 3 : s.unit === 'Bar' ? 2 : 0))));
          return { ...s, value: newVal };
        })
      );
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  const handleStartScan = () => {
    sounds.playScanTone();
    setIsScanning(true);
    setScanProgress(0);

    const stepTime = 30;
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          sounds.playSuccess();
          return 100;
        }
        return prev + 2;
      });
    }, stepTime);
  };

  const handleClearCodes = () => {
    sounds.playClick();
    setCodes([]);
    setSelectedDtc(null);
  };

  const handleResetCodes = () => {
    sounds.playClick();
    setCodes(INITIAL_DIAGNOSTIC_CODES);
    setSelectedDtc(INITIAL_DIAGNOSTIC_CODES[0]);
  };

  return (
    <section id="diagnostics" className="relative py-28 sm:py-36 bg-[#060608] border-t border-zinc-900 overflow-hidden">
      {/* Laser HUD Grid & Top Glow */}
      <div className="absolute inset-0 bg-tech-grid opacity-25 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-red-600/10 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-red-500/30 bg-red-950/40 text-xs font-mono text-red-400 mb-3 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
            <Radio size={14} className="text-red-500 animate-pulse" />
            <span>INTERACTIVE OEM DIAGNOSTIC WORKSTATION</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl uppercase tracking-tighter text-white">
            ELECTRONIC <span className="text-red-500">TELEMETRY</span> HUD
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base mt-3">
            Experience our live CAN-bus diagnostic interrogation simulator. Test real vehicle fault code extractions, live sensor streams, and ECU memory address decoding.
          </p>
        </div>

        {/* Main Diagnostic Terminal Frame */}
        <div className="rounded-3xl border border-white/10 bg-[#0a0a0e] shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden">
          {/* Terminal Top Control Bar */}
          <div className="px-6 py-4 border-b border-white/10 bg-zinc-950/80 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <div className="h-4 w-[1px] bg-zinc-800" />
              <div className="flex items-center gap-2 font-mono text-xs text-zinc-300">
                <Cpu size={14} className="text-red-500" />
                <span className="font-bold text-white">AUTEL MAXISYS ULTRA V3</span>
                <span className="text-zinc-500 hidden sm:inline">| PROTOCOL: ISO 15765-4 CAN</span>
              </div>
            </div>

            {/* Vehicle Selector Dropdown */}
            <div className="flex items-center gap-3">
              <select
                aria-label="Target Vehicle Engine ECU"
                value={selectedVehicle}
                onChange={(e) => {
                  sounds.playClick();
                  setSelectedVehicle(e.target.value);
                }}
                className="bg-zinc-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-mono text-zinc-300 focus:outline-none focus:border-red-500"
              >
                <option value="BMW G30 530i (B48 DME 8.4)">BMW G30 530i (B48 DME 8.4)</option>
                <option value="Mercedes-Benz W205 C300 (MED17.7.2)">Mercedes-Benz W205 C300 (MED17.7.2)</option>
                <option value="Toyota Land Cruiser V8 4.5 D4D (Denso)">Toyota Land Cruiser V8 4.5 D4D (Denso)</option>
                <option value="VW Golf 7 GTI 2.0 TSI (Simos 18.1)">VW Golf 7 GTI 2.0 TSI (Simos 18.1)</option>
              </select>

              <button
                id="diagnostic-re-scan-btn"
                data-cursor="SCAN"
                disabled={isScanning}
                onClick={handleStartScan}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs font-mono font-bold uppercase transition-all shadow-[0_0_15px_rgba(239,68,68,0.4)]"
              >
                <RefreshCw size={13} className={isScanning ? 'animate-spin' : ''} />
                <span>{isScanning ? 'SCANNING...' : 'TRIGGER FULL SCAN'}</span>
              </button>
            </div>
          </div>

          {/* Diagnostic Status Overview Bar */}
          <div className="px-6 py-3 bg-zinc-900/40 border-b border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-zinc-400">ECU LINK: </span>
              <span className="text-white font-bold">CONNECTED</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-zinc-400">SYSTEM STATUS: </span>
              <span className="text-red-400 font-bold">{isScanning ? `${scanProgress}% INTERROGATING` : '100% SCAN COMPLETE'}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-zinc-400">FAULTS DETECTED: </span>
              <span className={`font-bold ${codes.length > 0 ? 'text-red-500' : 'text-emerald-400'}`}>
                {codes.length < 10 ? `0${codes.length}` : codes.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-zinc-400">MONITORED: </span>
              <span className="text-zinc-200">ENGINE · ABS · SRS · BCM</span>
            </div>
          </div>

          {/* Scanning Progress Bar */}
          {isScanning && (
            <div className="relative h-1 w-full bg-zinc-900 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-red-600 via-white to-red-600 shadow-[0_0_10px_#ef4444]"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
          )}

          {/* Tab Navigation */}
          <div className="px-6 pt-4 border-b border-white/5 flex items-center gap-4 font-mono text-xs">
            <button
              onClick={() => {
                sounds.playClick();
                setActiveTab('dtc');
              }}
              className={`pb-3 border-b-2 font-bold uppercase transition-colors flex items-center gap-2 ${
                activeTab === 'dtc'
                  ? 'border-red-500 text-white'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <AlertTriangle size={14} className={codes.length > 0 ? 'text-red-500' : 'text-zinc-500'} />
              <span>DTC FAULT CODES ({codes.length})</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                setActiveTab('live_sensors');
              }}
              className={`pb-3 border-b-2 font-bold uppercase transition-colors flex items-center gap-2 ${
                activeTab === 'live_sensors'
                  ? 'border-red-500 text-white'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Activity size={14} className="text-red-500" />
              <span>LIVE TELEMETRY SENSORS</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                setActiveTab('ecu_hex');
              }}
              className={`pb-3 border-b-2 font-bold uppercase transition-colors flex items-center gap-2 ${
                activeTab === 'ecu_hex'
                  ? 'border-red-500 text-white'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Terminal size={14} className="text-red-500" />
              <span>ECU HEX MEMORY STREAM</span>
            </button>
          </div>

          {/* Tab Content Display */}
          <div className="p-6">
            {/* Tab 1: Diagnostic Trouble Codes (DTC) */}
            {activeTab === 'dtc' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Codes List (5 Columns) */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
                    <span>RECORDED CONTROL MODULE DTCS</span>
                    {codes.length > 0 ? (
                      <button
                        onClick={handleClearCodes}
                        className="text-red-400 hover:text-red-300 underline font-mono text-[11px]"
                      >
                        Simulate Clear
                      </button>
                    ) : (
                      <button
                        onClick={handleResetCodes}
                        className="text-emerald-400 hover:text-emerald-300 underline font-mono text-[11px]"
                      >
                        Reset Faults
                      </button>
                    )}
                  </div>

                  {codes.length === 0 ? (
                    <div className="p-8 rounded-2xl bg-zinc-900/30 border border-emerald-500/20 text-center flex flex-col items-center justify-center gap-3">
                      <CheckCircle2 size={36} className="text-emerald-500" />
                      <div className="font-mono text-sm text-emerald-300 font-bold">
                        NO ACTIVE DTC FAULTS
                      </div>
                      <p className="text-xs text-zinc-400 max-w-xs">
                        All vehicle electronic control modules pass system self-test with zero stored anomalies.
                      </p>
                    </div>
                  ) : (
                    codes.map((dtc) => {
                      const isSelected = selectedDtc?.code === dtc.code;
                      return (
                        <div
                          key={dtc.code}
                          onClick={() => {
                            sounds.playClick();
                            setSelectedDtc(dtc);
                          }}
                          className={`p-4 rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-red-950/40 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.25)]'
                              : 'bg-zinc-900/50 hover:bg-zinc-900 border-white/5 text-zinc-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-black text-base text-red-500">
                                {dtc.code}
                              </span>
                              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-white/5">
                                {dtc.system}
                              </span>
                            </div>
                            <span className="text-[10px] font-mono text-red-400 uppercase font-bold">
                              {dtc.status}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-300 mt-2 line-clamp-1">
                            {dtc.description}
                          </p>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Right Code Detail Inspector & Remedy Roadmap (7 Columns) */}
                <div className="lg:col-span-7">
                  {selectedDtc ? (
                    <div className="p-6 rounded-2xl bg-zinc-900/60 border border-white/10 space-y-5">
                      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                        <div>
                          <div className="text-[11px] font-mono uppercase text-zinc-500">
                            FAULT CODE ANALYSIS
                          </div>
                          <div className="font-display font-black text-2xl sm:text-3xl text-white">
                            {selectedDtc.code} · <span className="text-red-500">{selectedDtc.system}</span>
                          </div>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-red-600 text-white shadow-[0_0_10px_#ef4444]">
                          {selectedDtc.severity.toUpperCase()}
                        </span>
                      </div>

                      <div>
                        <div className="text-xs font-mono text-zinc-400 uppercase">Description</div>
                        <p className="text-sm text-zinc-200 mt-1 font-medium leading-relaxed">
                          {selectedDtc.description}
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/20">
                        <div className="flex items-center gap-2 text-xs font-mono text-red-400 font-bold uppercase mb-1">
                          <WrenchIcon size={14} />
                          <span>DANI &amp; MIKI REMEDY PROTOCOL</span>
                        </div>
                        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                          {selectedDtc.remedy}
                        </p>
                      </div>

                      {/* Immediate Booking Trigger */}
                      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-zinc-800">
                        <span className="text-xs font-mono text-zinc-400">
                          Need an expert engineer to solve this fault?
                        </span>
                        <button
                          id="dtc-book-repair-btn"
                          data-cursor="BOOK"
                          onClick={() => {
                            sounds.playClick();
                            onOpenBookingForDiagnosis();
                          }}
                          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold uppercase transition-all shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                        >
                          SCHEDULE FAULT REMEDY
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center p-12 rounded-2xl bg-zinc-900/30 border border-white/5 text-zinc-500 font-mono text-xs">
                      SELECT A FAULT CODE TO INSPECT REMEDY ROADMAP
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 2: Live Telemetry Sensors */}
            {activeTab === 'live_sensors' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sensors.map((sensor) => (
                  <div
                    key={sensor.id}
                    className="p-5 rounded-2xl bg-zinc-900/50 border border-white/10 hover:border-red-500/40 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
                      <span>{sensor.name}</span>
                      <span className="text-red-400 uppercase font-bold">{sensor.status}</span>
                    </div>

                    <div className="flex items-baseline gap-2 my-2">
                      <span className="font-mono font-black text-3xl text-white">
                        {sensor.value}
                      </span>
                      <span className="font-mono text-xs text-red-500 font-bold">
                        {sensor.unit}
                      </span>
                    </div>

                    {/* Sensor Scale Gauge Bar */}
                    <div className="w-full bg-zinc-800 rounded-full h-1.5 mt-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-red-600 to-red-400 h-1.5 rounded-full transition-all duration-700"
                        style={{
                          width: `${Math.min(100, Math.max(10, ((sensor.value - sensor.min) / (sensor.max - sensor.min)) * 100))}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 3: ECU Hex Memory Stream */}
            {activeTab === 'ecu_hex' && (
              <div className="p-4 rounded-xl bg-black font-mono text-xs text-zinc-400 overflow-x-auto space-y-1.5 border border-white/5">
                <div className="text-red-500 font-bold mb-2">
                  // READ DUMP: BOSCH MED17.7.2 TRICORE TC1797 FLASH 4096KB
                </div>
                <div className="text-zinc-500">0x00000000: 42 4F 53 43 48 20 4D 45 44 31 37 2E 37 2E 32 20  BOSCH MED17.7.2 </div>
                <div className="text-zinc-300">0x00000010: 57 49 4E 4F 4C 53 5F 43 41 4C 49 42 5F 53 54 47  WINOLS_CALIB_STG</div>
                <div className="text-red-400">0x00000020: 00 1F 4A 92 FF 38 C4 11 02 A8 99 F1 44 2B 00 1E  ..J..8......D+..</div>
                <div className="text-zinc-400">0x00000030: 28 44 4D 45 29 20 42 34 38 20 53 54 41 47 45 31  (DME) B48 STAGE1</div>
                <div className="text-zinc-500">0x00000040: 10 20 30 40 50 60 70 80 90 A0 B0 C0 D0 E0 F0 00  . 0@P`p.........</div>
                <div className="text-emerald-400 mt-2">
                  &gt; CHECKSUM RSA-2048: VALIDATED (OK) | WRITE PERMISSION: GRANTED
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

function WrenchIcon(props: { size?: number }) {
  return <Cpu size={props.size || 14} />;
}
