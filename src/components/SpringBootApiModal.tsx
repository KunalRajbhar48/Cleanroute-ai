import React, { useState } from 'react';
import { Code2, Copy, Check, Terminal, ExternalLink, ShieldCheck, Database } from 'lucide-react';
import {
  SPRING_BOOT_ENDPOINTS,
  SPRING_BOOT_CONTROLLER_CODE,
} from '../services/springBootApiSpec';

export const SpringBootApiModal: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState(SPRING_BOOT_ENDPOINTS[0]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(SPRING_BOOT_CONTROLLER_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-[#234D3C]/10 dark:border-[#8EAD9A]/15">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#6F8F7A] dark:text-[#A4B588]">
            <Terminal className="w-3.5 h-3.5" />
            <span>Backend Engineering Architecture</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#1E2923] dark:text-[#F5F3EA]">
            Spring Boot REST & OR-Tools Architecture
          </h1>
          <p className="text-sm text-[#66736B] dark:text-[#95A89D]">
            Production-grade RESTful specification designed for microservices, PostGIS spatial indexing, and Google OR-Tools VRP optimization.
          </p>
        </div>

        <button
          onClick={handleCopyCode}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#234D3C] dark:bg-[#3F755E] text-[#FAF8F2] text-xs font-semibold hover:opacity-90 transition-opacity self-start md:self-auto"
        >
          {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedCode ? 'Copied Controller' : 'Copy Spring Boot Java Code'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Endpoints Directory */}
        <div className="lg:col-span-5 p-5 rounded-3xl bg-[#FAF8F2] dark:bg-[#182820] border border-[#234D3C]/10 dark:border-[#8EAD9A]/15 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#234D3C]/8">
            <span className="font-bold text-xs uppercase text-[#66736B] dark:text-[#95A89D]">
              RESTful API Endpoints
            </span>
            <span className="text-[10px] font-mono text-[#6F8F7A] dark:text-[#A4B588]">
              OpenAPI 3.0 / v1
            </span>
          </div>

          <div className="space-y-2.5">
            {SPRING_BOOT_ENDPOINTS.map((ep) => {
              const isSelected = selectedEndpoint.path === ep.path;
              return (
                <div
                  key={ep.path}
                  onClick={() => setSelectedEndpoint(ep)}
                  className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#234D3C] text-[#FAF8F2] border-[#234D3C] shadow-md'
                      : 'border-[#234D3C]/8 dark:border-[#8EAD9A]/12 bg-[#EDEDE3]/40 dark:bg-[#14221A] text-[#1E2923] dark:text-[#F5F3EA] hover:border-[#234D3C]/25'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`font-mono font-bold text-[10px] px-2 py-0.5 rounded ${
                        ep.method === 'POST'
                          ? 'bg-[#8A9A70] text-[#FAF8F2]'
                          : ep.method === 'PATCH'
                          ? 'bg-[#6F8F7A] text-[#FAF8F2]'
                          : 'bg-[#234D3C] text-[#FAF8F2]'
                      }`}
                    >
                      {ep.method}
                    </span>
                    <span className="font-mono text-[11px] font-semibold truncate">{ep.path}</span>
                  </div>
                  <h4 className="font-bold">{ep.summary}</h4>
                </div>
              );
            })}
          </div>

          {/* Architecture badges */}
          <div className="pt-4 border-t border-[#234D3C]/8 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-[#66736B] dark:text-[#95A89D]">
              <Database className="w-4 h-4 text-[#6F8F7A]" />
              <span>Database: PostgreSQL 16 + PostGIS Spatial Engine</span>
            </div>
            <div className="flex items-center gap-2 text-[#66736B] dark:text-[#95A89D]">
              <ShieldCheck className="w-4 h-4 text-[#6F8F7A]" />
              <span>Auth: Spring Security JWT + Role-based Access (RBAC)</span>
            </div>
          </div>
        </div>

        {/* Right Column: Code & JSON Payload Viewer */}
        <div className="lg:col-span-7 space-y-6">
          {/* Endpoint Inspector */}
          <div className="p-6 rounded-3xl bg-[#FAF8F2] dark:bg-[#182820] border border-[#234D3C]/10 dark:border-[#8EAD9A]/15 shadow-sm space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono font-bold text-xs px-2.5 py-0.5 rounded bg-[#234D3C] text-[#FAF8F2]">
                  {selectedEndpoint.method}
                </span>
                <span className="font-mono font-bold text-sm text-[#1E2923] dark:text-[#F5F3EA]">
                  {selectedEndpoint.path}
                </span>
              </div>
              <p className="text-xs text-[#66736B] dark:text-[#95A89D]">
                {selectedEndpoint.description}
              </p>
            </div>

            {selectedEndpoint.requestBodySnippet && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold uppercase text-[#66736B] dark:text-[#95A89D]">
                  Request Payload (JSON):
                </span>
                <pre className="p-3.5 rounded-2xl bg-[#EDEDE3]/60 dark:bg-[#14221A] text-xs font-mono text-[#1E2923] dark:text-[#F5F3EA] overflow-x-auto border border-[#234D3C]/8">
                  {selectedEndpoint.requestBodySnippet}
                </pre>
              </div>
            )}

            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold uppercase text-[#66736B] dark:text-[#95A89D]">
                Response Payload (JSON):
              </span>
              <pre className="p-3.5 rounded-2xl bg-[#EDEDE3]/60 dark:bg-[#14221A] text-xs font-mono text-[#234D3C] dark:text-[#7EA38B] overflow-x-auto border border-[#234D3C]/8">
                {selectedEndpoint.responseSnippet}
              </pre>
            </div>
          </div>

          {/* Java Spring Boot Controller Code Box */}
          <div className="p-6 rounded-3xl bg-[#FAF8F2] dark:bg-[#182820] border border-[#234D3C]/10 dark:border-[#8EAD9A]/15 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#234D3C]/8">
              <span className="font-bold text-xs uppercase text-[#66736B] dark:text-[#95A89D]">
                Java Controller (Spring Boot 3.3.x)
              </span>
              <span className="text-[10px] font-mono text-[#6F8F7A]">
                CleanRouteMunicipalController.java
              </span>
            </div>

            <pre className="p-4 rounded-2xl bg-[#15241C] text-[#F5F3EA] text-xs font-mono overflow-x-auto max-h-[300px] leading-relaxed shadow-inner">
              {SPRING_BOOT_CONTROLLER_CODE}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
