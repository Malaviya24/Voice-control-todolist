// Problem Solver for Voice Todo App
// This script identifies and fixes common issues

function solveProblems() {
    console.log('🔧 Starting problem solver...');
    
    const issues = [];
    const fixes = [];
    
    // Check 1: Missing DOM elements
    const requiredElements = [
        'voiceBtn', 'voiceStatus', 'voiceIndicator',
        'todoInput', 'addBtn', 'todoList',
        'timerHours', 'timerMinutes', 'timerSeconds',
        'voiceVolume', 'voiceSpeed', 'voiceVolumeValue', 'voiceSpeedValue'
    ];
    
    requiredElements.forEach(id => {
        const element = document.getElementById(id);
        if (!element) {
            issues.push(`Missing element: ${id}`);
            fixes.push(`Create element with id="${id}"`);
        }
    });
    
    // Check 2: Voice recognition support
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
        issues.push('Voice recognition not supported in this browser');
        fixes.push('Use Chrome, Edge, or Firefox for voice features');
    }
    
    // Check 3: HTTPS requirement
    if (window.location.protocol !== 'https:' && 
        !window.location.hostname.includes('localhost') && 
        !window.location.hostname.includes('127.0.0.1')) {
        issues.push('Voice recognition requires HTTPS');
        fixes.push('Use HTTPS or localhost for voice features');
    }
    
    // Check 4: Console errors
    const originalError = console.error;
    const originalWarn = console.warn;
    const errors = [];
    
    console.error = function(...args) {
        errors.push('ERROR: ' + args.join(' '));
        originalError.apply(console, args);
    };
    
    console.warn = function(...args) {
        errors.push('WARN: ' + args.join(' '));
        originalWarn.apply(console, args);
    };
    
    // Check 5: App initialization
    if (!window.app) {
        issues.push('VoiceTodoApp not initialized');
        fixes.push('Check if script.js loaded correctly and DOM is ready');
    }
    
    // Restore original console methods
    setTimeout(() => {
        console.error = originalError;
        console.warn = originalWarn;
        
        // Display results
        console.log('🔍 Problem Analysis:');
        if (issues.length === 0) {
            console.log('✅ No issues found!');
        } else {
            console.log('❌ Issues found:');
            issues.forEach((issue, index) => {
                console.log(`${index + 1}. ${issue}`);
                console.log(`   Fix: ${fixes[index]}`);
            });
        }
        
        if (errors.length > 0) {
            console.log('🚨 Console errors detected:');
            errors.forEach(error => console.log(`   ${error}`));
        }
    }, 1000);
}

// Auto-run problem solver
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', solveProblems);
} else {
    solveProblems();
}
