class HackerAdvancedFeatures {
    constructor() {
      //avançado 
      this.gameState = {
        playerLevel: 1,
        experience: 0,
        skillPoints: 0,
        unlockedTools: ["basic-scan"],
        detectionLevel: 0,
        missions: [],
        inventory: [],
        achievements: []
      };
  
      this.elements = {
        gameContainer: document.getElementById('game-container'),
        networkMapBtn: null,
        playerStatsBtn: null,
        toolsMenuBtn: null,
        upgradeBtn: null,
        networkMapOverlay: null,
        playerStatsOverlay: null,
        toolsMenuOverlay: null,
        upgradeOverlay: null,
        alertSystem: null,
        missionLogContainer: null,
        detectionMeter: null
      };
  
      this.availableTools = [
        { id: "basic-scan", name: "Scanner Básico", level: 1, description: "Escaneia redes para vulnerabilidades básicas" },
        { id: "port-scanner", name: "Scanner de Portas", level: 2, description: "Identifica portas abertas em um sistema" },
        { id: "brute-force", name: "Força Bruta", level: 3, description: "Ataca senhas por força bruta" },
        { id: "packet-sniffer", name: "Sniffer de Pacotes", level: 4, description: "Intercepta tráfego na rede" },
        { id: "exploit-kit", name: "Kit de Exploração", level: 5, description: "Contém exploits para vulnerabilidades comuns" },
        { id: "rootkit", name: "Rootkit", level: 7, description: "Ferramenta avançada para acesso privilegiado" },
        { id: "stealth-module", name: "Módulo Stealth", level: 8, description: "Reduz detecção durante invasões" }
      ];
  
      this.availableMissions = [
        { 
          id: "mission-1", 
          name: "Primeiro Acesso", 
          level: 1, 
          description: "Invada um servidor simples com baixa segurança",
          reward: { xp: 50, tool: "port-scanner" }
        },
        { 
          id: "mission-2", 
          name: "Quebra de Senha", 
          level: 2, 
          description: "Descriptografe uma senha protegida por hash SHA-1",
          reward: { xp: 100 }
        },
        { 
          id: "mission-3", 
          name: "Dados Confidenciais", 
          level: 3, 
          description: "Extraia dados protegidos de um servidor seguro",
          reward: { xp: 150, tool: "brute-force" }
        },
        { 
          id: "mission-4", 
          name: "Intercepção de Rede", 
          level: 4, 
          description: "Intercepte comunicações em uma rede corporativa",
          reward: { xp: 200, tool: "packet-sniffer" }
        },
        { 
          id: "mission-5", 
          name: "Infraestrutura Crítica", 
          level: 5, 
          description: "Acesse um sistema de infraestrutura crítica",
          reward: { xp: 300, tool: "exploit-kit" }
        }
      ];
  
      this.networkNodes = [];
      
      this.init();
    }
  
    init() {
      this.createUIControls();
      this.loadGameState();
      this.initMissionSystem();
      this.setupAlertSystem();
      this.setupNetworkMap();
      this.setupDetectionMeter();
      this.setupEventListeners();
    }

    createUIControls() {
      const advancedControlsContainer = document.createElement('div');
      advancedControlsContainer.id = 'advanced-controls';
      advancedControlsContainer.className = 'flex justify-around mt-4 w-full';
      
      this.elements.networkMapBtn = this.createButton('Mapa de Rede', 'bg-purple-600', this.toggleNetworkMap.bind(this));
      this.elements.playerStatsBtn = this.createButton('Estatísticas', 'bg-blue-600', this.togglePlayerStats.bind(this));
      this.elements.toolsMenuBtn = this.createButton('Ferramentas', 'bg-yellow-600', this.toggleToolsMenu.bind(this));
      this.elements.upgradeBtn = this.createButton('Upgrades', 'bg-green-600', this.toggleUpgradeMenu.bind(this));
      
      advancedControlsContainer.appendChild(this.elements.networkMapBtn);
      advancedControlsContainer.appendChild(this.elements.playerStatsBtn);
      advancedControlsContainer.appendChild(this.elements.toolsMenuBtn);
      advancedControlsContainer.appendChild(this.elements.upgradeBtn);
      
      this.elements.gameContainer.appendChild(advancedControlsContainer);
      
      this.createOverlays();
      
      this.createDetectionMeter();
      
      this.createMissionLog();
    }

    createButton(text, colorClass, clickHandler) {
      const button = document.createElement('button');
      button.textContent = text;
      button.className = `px-4 py-2 ${colorClass} hover:opacity-80 rounded transition mr-2`;
      button.addEventListener('click', clickHandler);
      return button;
    }

    createOverlays() {
      const overlaysContainer = document.createElement('div');
      overlaysContainer.id = 'advanced-overlays';
      this.elements.gameContainer.appendChild(overlaysContainer);
      
      this.elements.networkMapOverlay = document.createElement('div');
      this.elements.networkMapOverlay.id = 'network-map-overlay';
      this.elements.networkMapOverlay.className = 'absolute top-0 left-0 w-full h-full bg-gray-900 bg-opacity-95 p-6 rounded hidden z-20';
      this.elements.networkMapOverlay.innerHTML = `
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl text-purple-500">MAPA DE REDE</h3>
          <button class="close-overlay text-white hover:text-red-500">&times;</button>
        </div>
        <div id="network-map-container" class="w-full h-64 bg-black rounded relative overflow-hidden">
          <canvas id="network-map-canvas" class="w-full h-full"></canvas>
        </div>
        <div class="mt-4 text-gray-300">
          <p class="mb-2">Nós detectados: <span id="nodes-count">0</span></p>
          <p>Conexões mapeadas: <span id="connections-count">0</span></p>
        </div>
      `;
      overlaysContainer.appendChild(this.elements.networkMapOverlay);
      
      this.elements.playerStatsOverlay = document.createElement('div');
      this.elements.playerStatsOverlay.id = 'player-stats-overlay';
      this.elements.playerStatsOverlay.className = 'absolute top-0 left-0 w-full h-full bg-gray-900 bg-opacity-95 p-6 rounded hidden z-20';
      this.elements.playerStatsOverlay.innerHTML = `
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl text-blue-500">ESTATÍSTICAS DO HACKER</h3>
          <button class="close-overlay text-white hover:text-red-500">&times;</button>
        </div>
        <div class="stats-container grid grid-cols-2 gap-4">
          <div class="stat-item">
            <h4 class="text-white">Nível:</h4>
            <p id="player-level" class="text-blue-400 text-2xl">1</p>
            <div class="w-full bg-gray-700 h-2 mt-1">
              <div id="xp-progress" class="bg-blue-500 h-full" style="width: 0%"></div>
            </div>
          </div>
          <div class="stat-item">
            <h4 class="text-white">Experiência:</h4>
            <p id="player-xp" class="text-blue-400 text-2xl">0 XP</p>
          </div>
          <div class="stat-item">
            <h4 class="text-white">Missões Concluídas:</h4>
            <p id="missions-completed" class="text-blue-400 text-2xl">0</p>
          </div>
          <div class="stat-item">
            <h4 class="text-white">Pontos de Habilidade:</h4>
            <p id="skill-points" class="text-blue-400 text-2xl">0</p>
          </div>
        </div>
        <div class="mt-6">
          <h4 class="text-white mb-2">Conquistas:</h4>
          <div id="achievements-container" class="grid grid-cols-3 gap-2">
            <div class="achievement bg-gray-800 p-2 rounded opacity-50">
              <div class="achievement-icon text-center text-2xl">🔐</div>
              <div class="achievement-name text-center text-xs mt-1">Primeiro Hack</div>
            </div>
            <div class="achievement bg-gray-800 p-2 rounded opacity-50">
              <div class="achievement-icon text-center text-2xl">💻</div>
              <div class="achievement-name text-center text-xs mt-1">Mestre da Rede</div>
            </div>
            <div class="achievement bg-gray-800 p-2 rounded opacity-50">
              <div class="achievement-icon text-center text-2xl">🛡️</div>
              <div class="achievement-name text-center text-xs mt-1">Stealth</div>
            </div>
            <div class="achievement bg-gray-800 p-2 rounded opacity-50">
              <div class="achievement-icon text-center text-2xl">📡</div>
              <div class="achievement-name text-center text-xs mt-1">Explorador</div>
            </div>
            <div class="achievement bg-gray-800 p-2 rounded opacity-50">
              <div class="achievement-icon text-center text-2xl">🔓</div>
              <div class="achievement-name text-center text-xs mt-1">Quebrador</div>
            </div>
            <div class="achievement bg-gray-800 p-2 rounded opacity-50">
              <div class="achievement-icon text-center text-2xl">⚡</div>
              <div class="achievement-name text-center text-xs mt-1">Penetração</div>
            </div>
          </div>
        </div>
      `;
      overlaysContainer.appendChild(this.elements.playerStatsOverlay);
      
      this.elements.toolsMenuOverlay = document.createElement('div');
      this.elements.toolsMenuOverlay.id = 'tools-menu-overlay';
      this.elements.toolsMenuOverlay.className = 'absolute top-0 left-0 w-full h-full bg-gray-900 bg-opacity-95 p-6 rounded hidden z-20';
      this.elements.toolsMenuOverlay.innerHTML = `
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl text-yellow-500">FERRAMENTAS DE HACKING</h3>
          <button class="close-overlay text-white hover:text-red-500">&times;</button>
        </div>
        <div id="tools-container" class="grid grid-cols-1 gap-2">
          <!-- Tools will be added here dynamically -->
        </div>
      `;
      overlaysContainer.appendChild(this.elements.toolsMenuOverlay);
      
      this.elements.upgradeOverlay = document.createElement('div');
      this.elements.upgradeOverlay.id = 'upgrade-overlay';
      this.elements.upgradeOverlay.className = 'absolute top-0 left-0 w-full h-full bg-gray-900 bg-opacity-95 p-6 rounded hidden z-20';
      this.elements.upgradeOverlay.innerHTML = `
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl text-green-500">UPGRADES</h3>
          <button class="close-overlay text-white hover:text-red-500">&times;</button>
        </div>
        <div class="flex items-center justify-between mb-6">
          <div>
            <span class="text-gray-400">Pontos disponíveis:</span>
            <span id="available-points" class="ml-2 text-green-500">0</span>
          </div>
        </div>
        <div id="upgrade-container" class="grid grid-cols-1 gap-4">
          <div class="upgrade-item bg-gray-800 p-4 rounded flex justify-between items-center">
            <div>
              <h4 class="text-white">Velocidade de Processamento</h4>
              <p class="text-gray-400 text-sm">Aumenta a velocidade de descriptografia</p>
            </div>
            <div class="flex items-center">
              <div class="mr-4">
                <div class="flex">
                  <div class="w-4 h-4 bg-green-500 mr-1"></div>
                  <div class="w-4 h-4 bg-gray-700 mr-1"></div>
                  <div class="w-4 h-4 bg-gray-700 mr-1"></div>
                  <div class="w-4 h-4 bg-gray-700 mr-1"></div>
                  <div class="w-4 h-4 bg-gray-700"></div>
                </div>
              </div>
              <button class="upgrade-btn px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm" data-upgrade="processing_speed">Upgrade</button>
            </div>
          </div>
          <div class="upgrade-item bg-gray-800 p-4 rounded flex justify-between items-center">
            <div>
              <h4 class="text-white">Stealth</h4>
              <p class="text-gray-400 text-sm">Reduz chance de detecção durante invasões</p>
            </div>
            <div class="flex items-center">
              <div class="mr-4">
                <div class="flex">
                  <div class="w-4 h-4 bg-green-500 mr-1"></div>
                  <div class="w-4 h-4 bg-gray-700 mr-1"></div>
                  <div class="w-4 h-4 bg-gray-700 mr-1"></div>
                  <div class="w-4 h-4 bg-gray-700 mr-1"></div>
                  <div class="w-4 h-4 bg-gray-700"></div>
                </div>
              </div>
              <button class="upgrade-btn px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm" data-upgrade="stealth">Upgrade</button>
            </div>
          </div>
          <div class="upgrade-item bg-gray-800 p-4 rounded flex justify-between items-center">
            <div>
              <h4 class="text-white">Força Bruta</h4>
              <p class="text-gray-400 text-sm">Aumenta eficiência ao quebrar senhas</p>
            </div>
            <div class="flex items-center">
              <div class="mr-4">
                <div class="flex">
                  <div class="w-4 h-4 bg-green-500 mr-1"></div>
                  <div class="w-4 h-4 bg-gray-700 mr-1"></div>
                  <div class="w-4 h-4 bg-gray-700 mr-1"></div>
                  <div class="w-4 h-4 bg-gray-700 mr-1"></div>
                  <div class="w-4 h-4 bg-gray-700"></div>
                </div>
              </div>
              <button class="upgrade-btn px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm" data-upgrade="brute_force">Upgrade</button>
            </div>
          </div>
          <div class="upgrade-item bg-gray-800 p-4 rounded flex justify-between items-center">
            <div>
              <h4 class="text-white">Análise de Rede</h4>
              <p class="text-gray-400 text-sm">Melhora capacidade de mapear redes</p>
            </div>
            <div class="flex items-center">
              <div class="mr-4">
                <div class="flex">
                  <div class="w-4 h-4 bg-green-500 mr-1"></div>
                  <div class="w-4 h-4 bg-gray-700 mr-1"></div>
                  <div class="w-4 h-4 bg-gray-700 mr-1"></div>
                  <div class="w-4 h-4 bg-gray-700 mr-1"></div>
                  <div class="w-4 h-4 bg-gray-700"></div>
                </div>
              </div>
              <button class="upgrade-btn px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm" data-upgrade="network_analysis">Upgrade</button>
            </div>
          </div>
        </div>
      `;
      overlaysContainer.appendChild(this.elements.upgradeOverlay);
      
      const closeButtons = document.querySelectorAll('.close-overlay');
      closeButtons.forEach(button => {
        button.addEventListener('click', () => {
          this.hideAllOverlays();
        });
      });
    }

    createDetectionMeter() {
      const detectionContainer = document.createElement('div');
      detectionContainer.className = 'detection-container flex items-center justify-between mt-4 mb-2 px-2';
      detectionContainer.innerHTML = `
        <div class="text-gray-400 text-sm">Nível de Detecção:</div>
        <div class="w-60 bg-gray-700 h-2 rounded overflow-hidden">
          <div id="detection-meter" class="bg-green-500 h-full transition-all" style="width: 0%"></div>
        </div>
      `;
      
      this.elements.gameContainer.insertBefore(detectionContainer, document.getElementById('advanced-controls'));
      this.elements.detectionMeter = document.getElementById('detection-meter');
    }

    createMissionLog() {
      const missionContainer = document.createElement('div');
      missionContainer.className = 'mission-container mt-6 bg-gray-800 p-4 rounded';
      missionContainer.innerHTML = `
        <div class="flex justify-between items-center mb-2">
          <h3 class="text-lg text-white">Missões Disponíveis</h3>
          <button id="refresh-missions" class="text-xs text-blue-500 hover:text-blue-400">Atualizar</button>
        </div>
        <div id="mission-log" class="mission-log space-y-2">
          <!-- As missões serão adicionadas aqui dinamicamente -->
        </div>
      `;
      
      this.elements.gameContainer.appendChild(missionContainer);
      this.elements.missionLogContainer = document.getElementById('mission-log');
      
      document.getElementById('refresh-missions').addEventListener('click', () => {
        this.refreshMissions();
      });
    }

    setupAlertSystem() {
      const alertSystem = document.createElement('div');
      alertSystem.id = 'alert-system';
      alertSystem.className = 'fixed top-4 right-4 w-80 z-50';
      document.body.appendChild(alertSystem);
      
      this.elements.alertSystem = alertSystem;
    }

    showAlert(message, type = 'info') {
      const alert = document.createElement('div');
      
      let colorClass = 'bg-blue-500';
      let icon = '❗';
      
      if (type === 'success') {
        colorClass = 'bg-green-500';
        icon = '✅';
      } else if (type === 'error') {
        colorClass = 'bg-red-500';
        icon = '⚠️';
      } else if (type === 'warning') {
        colorClass = 'bg-yellow-500';
        icon = '⚠️';
      }
      
      alert.className = `${colorClass} text-white p-3 rounded mb-2 flex items-start shadow-lg transition-all transform translate-x-full opacity-0`;
      alert.innerHTML = `
        <div class="mr-2">${icon}</div>
        <div class="flex-1">${message}</div>
        <button class="ml-2 text-white hover:text-gray-300">×</button>
      `;
      
      this.elements.alertSystem.appendChild(alert);
      
      setTimeout(() => {
        alert.classList.remove('translate-x-full', 'opacity-0');
      }, 10);
      
      const closeBtn = alert.querySelector('button');
      closeBtn.addEventListener('click', () => {
        this.closeAlert(alert);
      });
      
      setTimeout(() => {
        this.closeAlert(alert);
      }, 5000);
    }

    closeAlert(alert) {
      alert.classList.add('opacity-0', 'translate-x-full');
      
      setTimeout(() => {
        if (alert.parentNode) {
          alert.parentNode.removeChild(alert);
        }
      }, 300);
    }

    setupDetectionMeter() {
      this.gameState.detectionLevel = 0;
      this.updateDetectionMeter();
      
      this.detectionInterval = null;
    }

    updateDetectionMeter() {
      if (this.elements.detectionMeter) {
        const percentage = Math.min(this.gameState.detectionLevel, 100);
        this.elements.detectionMeter.style.width = `${percentage}%`;
        
        if (percentage < 30) {
          this.elements.detectionMeter.className = 'bg-green-500 h-full transition-all';
        } else if (percentage < 70) {
          this.elements.detectionMeter.className = 'bg-yellow-500 h-full transition-all';
        } else {
          this.elements.detectionMeter.className = 'bg-red-500 h-full transition-all';
        }
        
        if (percentage >= 100 && !this.alarmTriggered) {
          this.triggerSecurityAlert();
        }
      }
    }
    
    /**
     *detecção
     */
    startDetectionMonitoring() {
      this.stopDetectionMonitoring();
      
      this.detectionInterval = setInterval(() => {
        const stealthFactor = 1; 
        this.gameState.detectionLevel += (0.5 / stealthFactor); 
        this.updateDetectionMeter();
      }, 500);
      
      this.showAlert("Monitoramento de detecção iniciado", "warning");
    }
    
    /**
     *detecção
     */
    stopDetectionMonitoring() {
      if (this.detectionInterval) {
        clearInterval(this.detectionInterval);
        this.detectionInterval = null;
      }
    }
    
    /**
     *alerta de segurança
     */
    triggerSecurityAlert() {
      this.alarmTriggered = true;
      this.showAlert("ALERTA! VOCÊ FOI DETECTADO!", "error");
      
      document.body.classList.add('alert-active');
      document.querySelectorAll('.terminal-wrapper, #game-container').forEach(el => {
        el.classList.add('shake');
      });
      
      this.addLog("ALERTA DE SEGURANÇA! Sistema defensivo ativado!", "error");
      
      this.stopDetectionMonitoring();
      
      setTimeout(() => {
        document.body.classList.remove('alert-active');
        document.querySelectorAll('.terminal-wrapper, #game-container').forEach(el => {
          el.classList.remove('shake');
        });
        
        this.resetDetection();
      }, 5000);
    }
    
    resetDetection() {
      this.gameState.detectionLevel = 0;
      this.alarmTriggered = false;
      this.updateDetectionMeter();
    }

    setupNetworkMap() {
      this.networkCanvas = document.getElementById('network-map-canvas');
      this.networkContext = this.networkCanvas.getContext('2d');
      
      this.generateNetworkNodes(10); 
    }

    generateNetworkNodes(count) {
      this.networkNodes = [];
      
      for (let i = 0; i < count; i++) {
        const node = {
          id: `node-${i}`,
          x: Math.random() * 800,
          y: Math.random() * 400,
          radius: Math.random() * 5 + 5,
          type: Math.random() > 0.7 ? 'server' : 'client',
          connections: [],
          discovered: i < 3 
        };
        
        this.networkNodes.push(node);
      }
      
      //conexões entre nós
      for (let i = 0; i < this.networkNodes.length; i++) {
        const node = this.networkNodes[i];
        const connectionCount = Math.floor(Math.random() * 3) + 1; 
        
        for (let j = 0; j < connectionCount; j++) {
          let targetIndex;
          do {
            targetIndex = Math.floor(Math.random() * this.networkNodes.length);
          } while (targetIndex === i || node.connections.includes(targetIndex));
          
          node.connections.push(targetIndex);
          
          if (!this.networkNodes[targetIndex].connections.includes(i)) {
            this.networkNodes[targetIndex].connections.push(i);
          }
        }
      }
      
      this.renderNetworkMap();
    }

    renderNetworkMap() {
      if (!this.networkCanvas) return;
      
      const container = document.getElementById('network-map-container');
      if (container) {
           
     this.networkCanvas.width = container.offsetWidth;
     this.networkCanvas.height = container.offsetHeight;
   }
   
   const ctx = this.networkContext;
   ctx.clearRect(0, 0, this.networkCanvas.width, this.networkCanvas.height);
   
   //conexões
   ctx.strokeStyle = '#444';
   ctx.lineWidth = 1;
   
   this.networkNodes.forEach(node => {
     if (!node.discovered) return;
     
     node.connections.forEach(targetIndex => {
       const targetNode = this.networkNodes[targetIndex];
       if (!targetNode.discovered) return;
       
       ctx.beginPath();
       ctx.moveTo(node.x, node.y);
       ctx.lineTo(targetNode.x, targetNode.y);
       ctx.stroke();
     });
   });
   
   //nós
   this.networkNodes.forEach(node => {
     if (!node.discovered) return;
     
     ctx.beginPath();
     ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
     
     if (node.type === 'server') {
       ctx.fillStyle = '#e91e63';
     } else {
       ctx.fillStyle = '#2196f3';
     }
     
     ctx.fill();
     
     ctx.strokeStyle = '#fff';
     ctx.lineWidth = 1;
     ctx.stroke();
   });
   
   document.getElementById('nodes-count').textContent = this.networkNodes.filter(n => n.discovered).length;
   const connectionsCount = this.networkNodes.reduce((acc, node) => {
     if (node.discovered) {
       return acc + node.connections.filter(conn => this.networkNodes[conn].discovered).length;
     }
     return acc;
   }, 0) / 2; 
   document.getElementById('connections-count').textContent = Math.floor(connectionsCount);
 }
 
 discoverMoreNodes() {
   let newDiscoveries = 0;
   
   this.networkNodes.forEach((node, index) => {
     if (node.discovered) {
       node.connections.forEach(targetIndex => {
         const targetNode = this.networkNodes[targetIndex];
         if (!targetNode.discovered) {
           targetNode.discovered = Math.random() > 0.5; 
           if (targetNode.discovered) newDiscoveries++;
         }
       });
     }
   });
   
   if (newDiscoveries > 0) {
     this.showAlert(`${newDiscoveries} novos nós de rede descobertos!`, 'success');
     this.renderNetworkMap();
     
     this.addExperience(newDiscoveries * 10);
   } else {
     this.showAlert('Nenhum novo nó de rede descoberto', 'info');
   }
 }
 
 initMissionSystem() {
   this.refreshMissions();
 }

 refreshMissions() {
   if (!this.elements.missionLogContainer) return;
   
   this.elements.missionLogContainer.innerHTML = '';
   
   const availableMissions = this.availableMissions.filter(
     mission => mission.level <= this.gameState.playerLevel
   );
   
   if (availableMissions.length === 0) {
     this.elements.missionLogContainer.innerHTML = `
       <div class="text-gray-500 text-sm">Nenhuma missão disponível no momento.</div>
     `;
     return;
   }
   
   availableMissions.forEach(mission => {
     const isCompleted = this.gameState.missions.includes(mission.id);
     
     const missionElement = document.createElement('div');
     missionElement.className = `mission-item p-3 rounded ${isCompleted ? 'bg-gray-700 opacity-50' : 'bg-gray-900 hover:bg-gray-800'}`;
     missionElement.innerHTML = `
       <div class="flex justify-between items-start">
         <div>
           <h4 class="text-white">${mission.name}</h4>
           <p class="text-gray-400 text-xs">Nível ${mission.level}</p>
           <p class="text-gray-300 text-sm mt-1">${mission.description}</p>
         </div>
         <div class="ml-4">
           ${isCompleted ? 
             '<span class="text-green-500 text-xs">CONCLUÍDA</span>' :
             `<button class="start-mission px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs" data-mission="${mission.id}">Iniciar</button>`
           }
         </div>
       </div>
       ${mission.reward ? `
       <div class="mt-2 text-xs text-gray-400">
         Recompensa: ${mission.reward.xp} XP ${mission.reward.tool ? `+ Ferramenta: ${this.getToolName(mission.reward.tool)}` : ''}
       </div>
       ` : ''}
     `;
     
     if (!isCompleted) {
       const startButton = missionElement.querySelector('.start-mission');
       if (startButton) {
         startButton.addEventListener('click', () => {
           this.startMission(mission.id);
         });
       }
     }
     
     this.elements.missionLogContainer.appendChild(missionElement);
   });
 }

 getToolName(toolId) {
   const tool = this.availableTools.find(tool => tool.id === toolId);
   return tool ? tool.name : toolId;
 }
 
 startMission(missionId) {
   const mission = this.availableMissions.find(m => m.id === missionId);
   if (!mission) return;
   
   this.showAlert(`Missão iniciada: ${mission.name}`, 'info');
   this.hideAllOverlays();
   
   switch (missionId) {
     case 'mission-1':
       this.startServerAccessMinigame(mission);
       break;
     case 'mission-2':
       this.startPasswordCrackingMinigame(mission);
       break;
     case 'mission-3':
       this.startDataExtractionMinigame(mission);
       break;
     case 'mission-4':
       this.startNetworkInterceptionMinigame(mission);
       break;
     case 'mission-5':
       this.startCriticalInfrastructureMinigame(mission);
       break;
     default:
       this.showAlert('Minigame não implementado para esta missão.', 'error');
       break;
   }
 }

 startServerAccessMinigame(mission) {
   if (!this.gameState.unlockedTools.includes('basic-scan')) {
     this.showAlert('Você precisa do Scanner Básico para esta missão.', 'error');
     return;
   }
   
   this.addLog('Iniciando conexão com servidor alvo...', 'info');
   
   const minigameOverlay = document.createElement('div');
   minigameOverlay.className = 'absolute top-0 left-0 w-full h-full bg-black bg-opacity-90 flex flex-col items-center justify-center z-30';
   minigameOverlay.innerHTML = `
     <div class="bg-gray-900 p-6 rounded-lg w-3/4 max-w-2xl">
       <h3 class="text-xl text-blue-500 mb-4">ACESSO AO SERVIDOR</h3>
       
       <div class="server-access-game">
         <div class="mb-4">
           <p class="text-gray-300">Servidor alvo: 192.168.1.${Math.floor(Math.random() * 255)}</p>
           <p class="text-gray-300">Status: <span class="text-yellow-500">Escaneando portas...</span></p>
         </div>
         
         <div class="progress-container w-full bg-gray-800 h-4 rounded mb-6">
           <div class="progress-bar bg-blue-500 h-full rounded" style="width: 0%"></div>
         </div>
         
         <div class="port-scan-results mb-4">
           <div class="text-green-500 font-mono"></div>
         </div>
         
         <div class="flex items-center justify-between mt-6">
           <button class="cancel-minigame px-4 py-2 bg-red-600 hover:bg-red-700 rounded">Cancelar</button>
           <button class="exploit-server px-4 py-2 bg-green-600 hover:bg-green-700 rounded opacity-50" disabled>Explorar Vulnerabilidade</button>
         </div>
       </div>
     </div>
   `;
   
   document.body.appendChild(minigameOverlay);
   
   this.startDetectionMonitoring();
   
   const progressBar = minigameOverlay.querySelector('.progress-bar');
   const portScanResults = minigameOverlay.querySelector('.port-scan-results div');
   const exploitButton = minigameOverlay.querySelector('.exploit-server');
   let progress = 0;
   
   const progressInterval = setInterval(() => {
     progress += 1;
     progressBar.style.width = `${progress}%`;
     
     if (progress % 25 === 0) {
       const port = [21, 22, 80, 443][Math.floor(progress / 25) - 1];
       const service = ['FTP', 'SSH', 'HTTP', 'HTTPS'][Math.floor(progress / 25) - 1];
       
       portScanResults.innerHTML += `[+] Porta ${port} (${service}) - ${Math.random() > 0.7 ? '<span class="text-red-500">VULNERÁVEL</span>' : 'Segura'}<br>`;
     }
     
     if (progress >= 100) {
       clearInterval(progressInterval);
       exploitButton.classList.remove('opacity-50');
       exploitButton.disabled = false;
       minigameOverlay.querySelector('span.text-yellow-500').textContent = 'Pronto para explorar';
       minigameOverlay.querySelector('span.text-yellow-500').className = 'text-green-500';
       
       this.addLog('Scan completo. Vulnerabilidades encontradas!', 'success');
     }
   }, 50);
   
   minigameOverlay.querySelector('.cancel-minigame').addEventListener('click', () => {
     clearInterval(progressInterval);
     document.body.removeChild(minigameOverlay);
     this.stopDetectionMonitoring();
   });
   
   exploitButton.addEventListener('click', () => {
     this.completeMission(mission);
     clearInterval(progressInterval);
     document.body.removeChild(minigameOverlay);
     this.stopDetectionMonitoring();
   });
 }

 startPasswordCrackingMinigame(mission) {
   if (!this.gameState.unlockedTools.includes('port-scanner')) {
     this.showAlert('Você precisa do Scanner de Portas para esta missão.', 'error');
     return;
   }
   
   this.addLog('Iniciando processo de quebra de senha...', 'info');
   
   const minigameOverlay = document.createElement('div');
   minigameOverlay.className = 'absolute top-0 left-0 w-full h-full bg-black bg-opacity-90 flex flex-col items-center justify-center z-30';
   minigameOverlay.innerHTML = `
     <div class="bg-gray-900 p-6 rounded-lg w-3/4 max-w-2xl">
       <h3 class="text-xl text-blue-500 mb-4">QUEBRA DE SENHA</h3>
       
       <div class="password-crack-game">
         <div class="mb-4">
           <p class="text-gray-300">Hash SHA-1: <span class="text-yellow-500 font-mono">5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8</span></p>
           <p class="text-gray-300">Status: <span class="text-yellow-500">Tentando quebrar hash...</span></p>
         </div>
         
         <div class="progress-container w-full bg-gray-800 h-4 rounded mb-6">
           <div class="progress-bar bg-blue-500 h-full rounded" style="width: 0%"></div>
         </div>
         
         <div class="crack-results mb-4">
           <div class="text-green-500 font-mono"></div>
         </div>
         
         <div class="mt-4 password-guess-container">
           <div class="flex mb-2">
             <input type="text" class="password-guess bg-gray-800 text-white px-3 py-2 rounded w-full font-mono" placeholder="Digite uma senha para tentar...">
             <button class="try-password ml-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded">Tentar</button>
           </div>
           <div class="password-hint text-gray-400 text-sm"></div>
         </div>
         
         <div class="flex items-center justify-between mt-6">
           <button class="cancel-minigame px-4 py-2 bg-red-600 hover:bg-red-700 rounded">Cancelar</button>
           <button class="submit-password px-4 py-2 bg-green-600 hover:bg-green-700 rounded opacity-50" disabled>Submeter Senha</button>
         </div>
       </div>
     </div>
   `;
   
   document.body.appendChild(minigameOverlay);
   
   this.startDetectionMonitoring();
   
   const targetPassword = "password";
   
   const progressBar = minigameOverlay.querySelector('.progress-bar');
   const crackResults = minigameOverlay.querySelector('.crack-results div');
   const passwordInput = minigameOverlay.querySelector('.password-guess');
   const tryPasswordButton = minigameOverlay.querySelector('.try-password');
   const submitButton = minigameOverlay.querySelector('.submit-password');
   const passwordHint = minigameOverlay.querySelector('.password-hint');
   let progress = 0;
   
   const progressInterval = setInterval(() => {
     progress += 0.5;
     progressBar.style.width = `${progress}%`;
     
     if (progress % 20 === 0) {
       const hints = [
         "Senha parece ser comum...",
         "Começa com 'p'...",
         "Tem 8 caracteres...",
         "Contém 'word' no final...",
         "É uma das senhas mais usadas no mundo..."
       ];
       
       crackResults.innerHTML += `[+] Descoberta: ${hints[Math.floor(progress / 20) - 1]}<br>`;
       
       passwordHint.textContent = hints[Math.floor(progress / 20) - 1];
     }
     
     if (progress >= 100) {
       clearInterval(progressInterval);
       crackResults.innerHTML += `[!] SENHA QUEBRADA: "${targetPassword}"<br>`;
       
       passwordInput.value = targetPassword;
       
       submitButton.classList.remove('opacity-50');
       submitButton.disabled = false;
       
       minigameOverlay.querySelector('span.text-yellow-500:not(.font-mono)').textContent = 'Hash quebrado!';
       minigameOverlay.querySelector('span.text-yellow-500:not(.font-mono)').className = 'text-green-500';
       
       this.addLog('Hash SHA-1 quebrado com sucesso!', 'success');
     }
   }, 100);
   
   minigameOverlay.querySelector('.cancel-minigame').addEventListener('click', () => {
     clearInterval(progressInterval);
     document.body.removeChild(minigameOverlay);
     this.stopDetectionMonitoring();
   });
   
   tryPasswordButton.addEventListener('click', () => {
     const guessedPassword = passwordInput.value.trim();
     
     if (guessedPassword === targetPassword) {
       crackResults.innerHTML += `[!] SENHA CORRETA: "${guessedPassword}"<br>`;
       
       submitButton.classList.remove('opacity-50');
       submitButton.disabled = false;
       
       minigameOverlay.querySelector('span.text-yellow-500:not(.font-mono)').textContent = 'Senha correta!';
       minigameOverlay.querySelector('span.text-yellow-500:not(.font-mono)').className = 'text-green-500';
       
       this.addLog('Senha correta encontrada! Acesso garantido.', 'success');
     } else {
       crackResults.innerHTML += `[-] Tentativa falha: "${guessedPassword}"<br>`;
       
       this.gameState.detectionLevel += 5;
       this.updateDetectionMeter();
       
       this.addLog(`Tentativa de senha falhou: ${guessedPassword}`, 'error');
     }
   });
   
   submitButton.addEventListener('click', () => {
     this.completeMission(mission);
     clearInterval(progressInterval);
     document.body.removeChild(minigameOverlay);
     this.stopDetectionMonitoring();
   });
 }
 
 startDataExtractionMinigame(mission) {
   this.addLog('Iniciando extração de dados...', 'info');
   
   setTimeout(() => {
     this.completeMission(mission);
   }, 3000);
 }

 startNetworkInterceptionMinigame(mission) {
   this.addLog('Iniciando interceptação de rede...', 'info');
   
   setTimeout(() => {
     this.completeMission(mission);
   }, 3000);
 }

 startCriticalInfrastructureMinigame(mission) {
   this.addLog('Acessando infraestrutura crítica...', 'info');
   
   setTimeout(() => {
     this.completeMission(mission);
   }, 3000);
 }

 completeMission(mission) {
   if (this.gameState.missions.includes(mission.id)) {
     this.showAlert('Missão já concluída anteriormente', 'info');
     return;
   }
   
   this.gameState.missions.push(mission.id);
   
   if (mission.reward) {
     if (mission.reward.xp) {
       this.addExperience(mission.reward.xp);
     }
     
     if (mission.reward.tool && !this.gameState.unlockedTools.includes(mission.reward.tool)) {
       this.unlockTool(mission.reward.tool);
     }
   }
   
   this.showAlert(`Missão concluída: ${mission.name}`, 'success');
   
   this.addLog(`Missão "${mission.name}" concluída com sucesso!`, 'success');
   
   this.refreshMissions();
   this.updatePlayerStats();
   this.saveGameState();
 }

 addLog(message, type = 'info') {
   const terminalOutput = document.getElementById('terminal-output');
   if (!terminalOutput) return;
   
   const logEntry = document.createElement('div');
   logEntry.className = 'terminal-line';
   
   const date = new Date();
   const time = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
   
   let colorClass = 'text-blue-400';
   let prefix = 'INFO';
   
   if (type === 'success') {
     colorClass = 'text-green-400';
     prefix = 'SUCCESS';
   } else if (type === 'error') {
     colorClass = 'text-red-400';
     prefix = 'ERROR';
   } else if (type === 'warning') {
     colorClass = 'text-yellow-400';
     prefix = 'WARNING';
   }
   
   logEntry.innerHTML = `<span class="text-gray-500">[${time}]</span> <span class="${colorClass}">[${prefix}]</span> ${message}`;
   
   terminalOutput.appendChild(logEntry);
   terminalOutput.scrollTop = terminalOutput.scrollHeight;
 }
 
 addExperience(amount) {
   this.gameState.experience += amount;
   
   const nextLevelThreshold = this.calculateNextLevelXP();
   
   if (this.gameState.experience >= nextLevelThreshold) {
     this.levelUp();
   }
   
   this.updatePlayerStats();
   this.saveGameState();
 }

 calculateNextLevelXP() {
   return 100 * Math.pow(1.5, this.gameState.playerLevel - 1);
 }

 levelUp() {
   this.gameState.playerLevel++;
   this.gameState.skillPoints++;
   
   this.showAlert(`LEVEL UP! Você alcançou o nível ${this.gameState.playerLevel}!`, 'success');
   
   this.addLog(`Você subiu para o nível ${this.gameState.playerLevel}!`, 'success');
   
   this.checkToolUnlocks();
 }

 checkToolUnlocks() {
   this.availableTools.forEach(tool => {
     if (tool.level <= this.gameState.playerLevel && !this.gameState.unlockedTools.includes(tool.id)) {
       this.unlockTool(tool.id, false); 
     }
   });
 }

 unlockTool(toolId, showNotification = true) {
   if (this.gameState.unlockedTools.includes(toolId)) return;
   
   const tool = this.availableTools.find(t => t.id === toolId);
   if (!tool) return;
   
   this.gameState.unlockedTools.push(toolId);
   
   if (showNotification) {
     this.showAlert(`Nova ferramenta desbloqueada: ${tool.name}`, 'success');
     
     this.addLog(`Ferramenta desbloqueada: ${tool.name}`, 'success');
   }
   
   this.updateToolsMenu();
   this.saveGameState();
 }

 updateToolsMenu() {
   const toolsContainer = document.getElementById('tools-container');
   if (!toolsContainer) return;
   
   toolsContainer.innerHTML = '';
   
   this.gameState.unlockedTools.forEach(toolId => {
     const tool = this.availableTools.find(t => t.id === toolId);
     if (!tool) return;
     
     const toolElement = document.createElement('div');
     toolElement.className = 'tool-item p-3 bg-gray-800 rounded hover:bg-gray-700 mb-2';
     toolElement.innerHTML = `
       <div class="flex justify-between items-start">
         <div>
           <h4 class="text-white">${tool.name}</h4>
           <p class="text-gray-300 text-sm mt-1">${tool.description}</p>
         </div>
         <div class="ml-4">
           <button class="use-tool px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm" data-tool="${tool.id}">Usar</button>
         </div>
       </div>
     `;
     
     const useButton = toolElement.querySelector('.use-tool');
     useButton.addEventListener('click', () => {
       this.useTool(tool.id);
     });
     
     toolsContainer.appendChild(toolElement);
   });
   
   this.availableTools.forEach(tool => {
     if (this.gameState.unlockedTools.includes(tool.id)) return;
     
     const toolElement = document.createElement('div');
     toolElement.className = 'tool-item p-3 bg-gray-800 rounded opacity-50 mb-2';
     toolElement.innerHTML = `
       <div class="flex justify-between items-start">
         <div>
           <h4 class="text-white">${tool.name}</h4>
           <p class="text-gray-300 text-sm mt-1">${tool.description}</p>
         </div>
         <div class="ml-4">
           <span class="text-gray-400 text-xs">Requer Nível ${tool.level}</span>
         </div>
       </div>
     `;
     
     toolsContainer.appendChild(toolElement);
   });
 }

 useTool(toolId) {
   const tool = this.availableTools.find(t => t.id === toolId);
   if (!tool) return;
   
   this.showAlert(`Usando ferramenta: ${tool.name}`, 'info');
   this.hideAllOverlays();
   
   switch (toolId) {
     case 'basic-scan':
       this.useBasicScan();
       break;
     case 'port-scanner':
       this.usePortScanner();
       break;
     case 'brute-force':
       this.useBruteForce();
       break;
     case 'packet-sniffer':
       this.usePacketSniffer();
       break;
     case 'exploit-kit':
       this.useExploitKit();
       break;
     case 'rootkit':
       this.useRootkit();
       break;
     case 'stealth-module':
       this.useStealthModule();
       break;
     default:
       this.addLog(`Ferramenta ${tool.name} ainda não implementada.`, 'warning');
       break;
   }
 }

 useBasicScan() {
   this.addLog('Iniciando scan básico da rede...', 'info');
   this.discoverMoreNodes();
 }
 
 usePortScanner() {
   this.addLog('Iniciando scan de portas...', 'info');
   
   setTimeout(() => {
     const portsFound = Math.floor(Math.random() * 10) + 5;
     this.addLog(`Scan completo. ${portsFound} portas encontradas.`, 'success');        
        this.addExperience(15);
      }, 2000);
    }

    useBruteForce() {
      this.addLog('Iniciando ataque de força bruta...', 'info');
      
      this.startDetectionMonitoring();
      
      setTimeout(() => {
        const success = Math.random() > 0.3;
        
        if (success) {
          this.addLog('Ataque de força bruta bem-sucedido! Acesso obtido.', 'success');
          this.addExperience(25);
        } else {
          this.addLog('Ataque de força bruta falhou. Alvo muito protegido.', 'error');
          this.gameState.detectionLevel += 15;
          this.updateDetectionMeter();
        }
        
        this.stopDetectionMonitoring();
      }, 3000);
    }

    usePacketSniffer() {
      this.addLog('Iniciando captura de pacotes na rede...', 'info');
      
      this.startDetectionMonitoring();
      
      let captureCount = 0;
      const captureInterval = setInterval(() => {
        captureCount++;
        
        const packetTypes = ['HTTP', 'DNS', 'SMTP', 'FTP', 'SSH'];
        const randomType = packetTypes[Math.floor(Math.random() * packetTypes.length)];
        
        this.addLog(`Pacote capturado: ${randomType} - ${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`, 'info');
        
        if (captureCount >= 5) {
          clearInterval(captureInterval);
          this.addLog('Captura de pacotes concluída.', 'success');
          this.addExperience(20);
          this.stopDetectionMonitoring();
        }
      }, 1000);
    }

    useExploitKit() {
      this.addLog('Procurando vulnerabilidades para explorar...', 'info');
      
      setTimeout(() => {
        const vulnerabilities = [
          'SQL Injection em form.php',
          'Cross-Site Scripting em search.js',
          'Buffer Overflow em login_handler',
          'Command Execution em upload.php',
          'Directory Traversal em file_viewer.php'
        ];
        
        const vulnCount = Math.floor(Math.random() * 3) + 1;
        
        for (let i = 0; i < vulnCount; i++) {
          const randomIndex = Math.floor(Math.random() * vulnerabilities.length);
          const vulnerability = vulnerabilities.splice(randomIndex, 1)[0];
          
          this.addLog(`Vulnerabilidade encontrada: ${vulnerability}`, 'success');
        }
        
        if (vulnCount > 0) {
          this.addExperience(vulnCount * 15);
        } else {
          this.addLog('Nenhuma vulnerabilidade encontrada.', 'error');
        }
      }, 2500);
    }

    useRootkit() {
      this.addLog('Tentando instalar rootkit no sistema...', 'warning');
      
      this.startDetectionMonitoring();
      this.gameState.detectionLevel += 10;
      this.updateDetectionMeter();
      
      setTimeout(() => {
        const success = Math.random() > 0.5;
        
        if (success) {
          this.addLog('Rootkit instalado com sucesso! Acesso privilegiado obtido.', 'success');
          this.addExperience(50);
        } else {
          this.addLog('Falha ao instalar rootkit. Sistema protegido.', 'error');
          this.gameState.detectionLevel += 30;
          this.updateDetectionMeter();
        }
        
        this.stopDetectionMonitoring();
      }, 4000);
    }

    useStealthModule() {
      this.addLog('Ativando módulo stealth...', 'info');
      
      this.gameState.detectionLevel = Math.max(0, this.gameState.detectionLevel - 30);
      this.updateDetectionMeter();
      
      this.addLog('Pegadas digitais removidas. Nível de detecção reduzido.', 'success');
      this.addExperience(10);
    }

    updatePlayerStats() {
      document.getElementById('player-level').textContent = this.gameState.playerLevel;
      document.getElementById('player-xp').textContent = `${this.gameState.experience} XP`;
      document.getElementById('skill-points').textContent = this.gameState.skillPoints;
      document.getElementById('missions-completed').textContent = this.gameState.missions.length;
      document.getElementById('available-points').textContent = this.gameState.skillPoints;
      
      const nextLevelXP = this.calculateNextLevelXP();
      const percentage = (this.gameState.experience / nextLevelXP) * 100;
      document.getElementById('xp-progress').style.width = `${percentage}%`;
      
      this.updateAchievements();
    }

    updateAchievements() {
      const achievements = [
        {id: 'first-hack', condition: this.gameState.missions.length > 0, name: 'Primeiro Hack', icon: '🔐'},
        {id: 'network-master', condition: this.networkNodes.filter(n => n.discovered).length >= 10, name: 'Mestre da Rede', icon: '💻'},
        {id: 'stealth', condition: this.gameState.unlockedTools.includes('stealth-module'), name: 'Stealth', icon: '🛡️'},
        {id: 'explorer', condition: this.gameState.playerLevel >= 5, name: 'Explorador', icon: '📡'},
        {id: 'breaker', condition: this.gameState.missions.includes('mission-2'), name: 'Quebrador', icon: '🔓'},
        {id: 'penetration', condition: this.gameState.missions.includes('mission-5'), name: 'Penetração', icon: '⚡'}
      ];
      
      achievements.forEach(achievement => {
        if (achievement.condition && !this.gameState.achievements.includes(achievement.id)) {
          this.gameState.achievements.push(achievement.id);
          
          this.showAlert(`Nova conquista desbloqueada: ${achievement.name}`, 'success');
        }
      });
      
      const achievementsContainer = document.getElementById('achievements-container');
      if (!achievementsContainer) return;
      
      const achievementElements = achievementsContainer.querySelectorAll('.achievement');
      
      achievements.forEach((achievement, index) => {
        if (index < achievementElements.length) {
          if (this.gameState.achievements.includes(achievement.id)) {
            achievementElements[index].classList.remove('opacity-50');
          } else {
            achievementElements[index].classList.add('opacity-50');
          }
        }
      });
    }

    setupEventListeners() {
      const upgradeButtons = document.querySelectorAll('.upgrade-btn');
      upgradeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          const upgradeType = e.target.getAttribute('data-upgrade');
          this.performUpgrade(upgradeType);
        });
      });
      
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.hideAllOverlays();
        }
      });
    }

    performUpgrade(upgradeType) {
      if (this.gameState.skillPoints <= 0) {
        this.showAlert('Pontos de habilidade insuficientes', 'error');
        return;
      }
      
      switch (upgradeType) {
        case 'processing_speed':
          this.showAlert('Velocidade de processamento aumentada', 'success');
          break;
        case 'stealth':
          this.showAlert('Capacidade stealth melhorada', 'success');
          break;
        case 'brute_force':
          this.showAlert('Eficiência de força bruta aumentada', 'success');
          break;
        case 'network_analysis':
          this.showAlert('Capacidade de análise de rede aprimorada', 'success');
          break;
        default:
          return;
      }
      
      this.gameState.skillPoints--;
      
      this.updatePlayerStats();
      this.saveGameState();
    }

    toggleNetworkMap() {
      this.hideAllOverlays();
      this.elements.networkMapOverlay.classList.toggle('hidden');
      
      if (!this.elements.networkMapOverlay.classList.contains('hidden')) {
        const container = document.getElementById('network-map-container');
        if (container && this.networkCanvas) {
          this.networkCanvas.width = container.offsetWidth;
          this.networkCanvas.height = container.offsetHeight;
          this.renderNetworkMap();
        }
      }
    }

    togglePlayerStats() {
      this.hideAllOverlays();
      this.elements.playerStatsOverlay.classList.toggle('hidden');
      
      if (!this.elements.playerStatsOverlay.classList.contains('hidden')) {
        this.updatePlayerStats();
      }
    }

    toggleToolsMenu() {
      this.hideAllOverlays();
      this.elements.toolsMenuOverlay.classList.toggle('hidden');
      
      if (!this.elements.toolsMenuOverlay.classList.contains('hidden')) {
        this.updateToolsMenu();
      }
    }

    toggleUpgradeMenu() {
      this.hideAllOverlays();
      this.elements.upgradeOverlay.classList.toggle('hidden');
      
      if (!this.elements.upgradeOverlay.classList.contains('hidden')) {
        document.getElementById('available-points').textContent = this.gameState.skillPoints;
      }
    }

    hideAllOverlays() {
      this.elements.networkMapOverlay.classList.add('hidden');
      this.elements.playerStatsOverlay.classList.add('hidden');
      this.elements.toolsMenuOverlay.classList.add('hidden');
      this.elements.upgradeOverlay.classList.add('hidden');
    }

    saveGameState() {
      localStorage.setItem('hackerGameState', JSON.stringify(this.gameState));
    }

    loadGameState() {
      const savedState = localStorage.getItem('hackerGameState');
      
      if (savedState) {
        try {
          const parsedState = JSON.parse(savedState);
          this.gameState = {...this.gameState, ...parsedState};
          
          this.addLog('Estado do jogo carregado', 'info');
          
          this.updatePlayerStats();
        } catch (error) {
          console.error('Erro ao carregar estado do jogo:', error);
        }
      }
    }

    resetGameState() {
      if (!confirm('Tem certeza que deseja resetar todo o progresso?')) {
        return;
      }
      
      localStorage.removeItem('hackerGameState');
      
      this.gameState = {
        playerLevel: 1,
        experience: 0,
        skillPoints: 0,
        unlockedTools: ["basic-scan"],
        detectionLevel: 0,
        missions: [],
        inventory: [],
        achievements: []
      };
      
      this.addLog('Progresso do jogo resetado', 'warning');
      
      this.updatePlayerStats();
      this.refreshMissions();
      this.updateToolsMenu();
      this.resetDetection();
    }
}

document.addEventListener('DOMContentLoaded', () => {
  window.hackerAdvancedFeatures = new HackerAdvancedFeatures();
  
  const terminalInput = document.getElementById('terminal-input');
  
  if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const command = terminalInput.value.trim().toLowerCase();
        
        if (command === 'reset') {
          window.hackerAdvancedFeatures.resetGameState();
          terminalInput.value = '';
          e.preventDefault();
        } else if (command === 'help') {
          window.hackerAdvancedFeatures.addLog('Comandos disponíveis:', 'info');
          window.hackerAdvancedFeatures.addLog('reset - Reseta todo o progresso do jogo', 'info');
          window.hackerAdvancedFeatures.addLog('help - Mostra esta mensagem de ajuda', 'info');
          window.hackerAdvancedFeatures.addLog('level up - Adiciona XP suficiente para subir de nível', 'info');
          window.hackerAdvancedFeatures.addLog('scan - Executa um scan básico da rede', 'info');
          terminalInput.value = '';
          e.preventDefault();
        } else if (command === 'level up') {
          const nextLevelXP = window.hackerAdvancedFeatures.calculateNextLevelXP();
          const needed = nextLevelXP - window.hackerAdvancedFeatures.gameState.experience;
          window.hackerAdvancedFeatures.addExperience(needed);
          terminalInput.value = '';
          e.preventDefault();
        } else if (command === 'scan') {
          window.hackerAdvancedFeatures.useBasicScan();
          terminalInput.value = '';
          e.preventDefault();
        }
      }
    });
  }
  
  const style = document.createElement('style');
  style.textContent = `
    .alert-active {
      background-color: rgba(255, 0, 0, 0.2);
    }
    
    .shake {
      animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
      animation-iteration-count: infinite;
    }
    
    @keyframes shake {
      0% { transform: translate(0, 0) rotate(0); }
      20% { transform: translate(-2px, 0) rotate(-1deg); }
      40% { transform: translate(2px, 0) rotate(1deg); }
      60% { transform: translate(-2px, 0) rotate(-1deg); }
      80% { transform: translate(2px, 0) rotate(1deg); }
      100% { transform: translate(0, 0) rotate(0); }
    }
  `;
  document.head.appendChild(style);

  //código finalizado, agora é só esperar os bugs aparecerem
  //Fe – o dev mestre dos bugs
  
  /*
       ,--./,-.        </ >ˆ$
      / #      /     
     |       | 
      \        \  
       `._,._,'
  */

});  