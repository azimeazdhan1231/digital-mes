// script.js - Interactivity for Mektronicsgroup Dashboard

document.addEventListener('DOMContentLoaded', () => {

    // --- Utility Functions (Optional, but can be helpful) ---
    const isDarkMode = () => document.body.classList.contains('dark');

    // --- Theme Toggling ---
    const themeToggleButton = document.getElementById('theme-toggle');
    const themeToggleButtonMobile = document.getElementById('theme-toggle-mobile');
    const themeToggleMobileText = document.getElementById('theme-toggle-mobile-text');
    const themeToggleMobileIcon = document.getElementById('theme-toggle-mobile-icon');
    const sunIconSvg = `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 14.95a1 1 0 101.414 1.414l.707-.707a1 1 0 10-1.414-1.414l-.707.707zm-.707-7.071a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414-1.414l-.707-.707zM3 11a1 1 0 100-2H2a1 1 0 100 2h1z" fill-rule="evenodd" clip-rule="evenodd"></path></svg>`;
    const moonIconSvg = `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path></svg>`;

    const applyTheme = (makeDark) => {
        if (makeDark) {
            document.body.classList.add('dark');
            themeToggleMobileText.textContent = 'Light Mode';
            themeToggleMobileIcon.innerHTML = sunIconSvg;
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark');
            themeToggleMobileText.textContent = 'Dark Mode';
            themeToggleMobileIcon.innerHTML = moonIconSvg;
            localStorage.setItem('theme', 'light');
        }
        // Update charts if they exist
         if (typeof updateChartThemes === 'function') {
            updateChartThemes();
         }
    };

    const toggleTheme = () => {
        applyTheme(!isDarkMode());
    };

    // Event listeners for both buttons
    if (themeToggleButton) themeToggleButton.addEventListener('click', toggleTheme);
    if (themeToggleButtonMobile) themeToggleButtonMobile.addEventListener('click', toggleTheme);

    // Apply saved theme on initial load
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (savedTheme === null && prefersDark)) {
        applyTheme(true);
    } else {
        applyTheme(false); // Default to light
    }

    // --- Mobile Navigation ---
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu'); // The mobile menu container

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            const isActive = navMenu.classList.toggle('active'); // Toggle state
            navMenu.classList.toggle('hidden', !isActive); // Toggle hidden based on active state
        });

        // Close mobile menu when a link inside it is clicked
        navMenu.querySelectorAll('a.nav-link, button').forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    navMenu.classList.add('hidden');
                }
            });
        });
    } else {
        console.warn("Hamburger menu or nav menu element not found.");
    }


    // --- Tab Switching ---
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
        const tabId = button.dataset.tab;
        const sectionCard = button.closest('.card'); // Find the parent card
        if (!sectionCard || !tabId) return;

        // Deactivate all content and buttons within *this specific card*
        sectionCard.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        sectionCard.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));

        // Activate the selected tab and content within *this specific card*
        const activeContent = sectionCard.querySelector(`#${tabId}`);
        if (activeContent) {
            activeContent.classList.add('active');
        } else {
            console.warn(`Tab content with ID #${tabId} not found within the card.`);
        }
        button.classList.add('active'); // Activate the clicked button
      });
    });

    // --- Budget Simulator ---
    const budgetSlider = document.getElementById('budget-slider');
    const budgetValueSpan = document.getElementById('budget-value');
    const projectedClicksP = document.getElementById('projected-clicks');
    const projectedConversionsP = document.getElementById('projected-conversions'); // Changed label to Leads in HTML
    const projectedCpaP = document.getElementById('projected-cpa'); // Changed label to CPL in HTML

    function updateBudgetSimulation() {
        if (!budgetSlider || !budgetValueSpan || !projectedClicksP || !projectedConversionsP || !projectedCpaP) return; // Exit if elements missing

        const budgetThousands = parseInt(budgetSlider.value);
        budgetValueSpan.textContent = `BDT ${budgetThousands}k`;

        // Example simulation logic (adjust factors based on real data/expectations)
        const clicks = Math.floor(budgetThousands * 5); // Example: 5 clicks per 1k BDT spent
        const leads = Math.max(1, Math.floor(clicks * 0.08)); // Example: 8% CVR from clicks, minimum 1 lead
        const costPerLead = leads > 0 ? (budgetThousands * 1000 / leads) : 0; // Calculate CPL in actual BDT

        projectedClicksP.textContent = clicks.toLocaleString(); // Format number
        projectedConversionsP.textContent = leads.toLocaleString(); // Format number
        projectedCpaP.textContent = costPerLead > 0 ? `BDT ${Math.round(costPerLead / 1000)}k` : 'N/A'; // Display CPL rounded to nearest k BDT
    }

    if (budgetSlider) {
        budgetSlider.addEventListener('input', updateBudgetSimulation);
        updateBudgetSimulation(); // Initial calculation on load
    }

    // --- Ad Preview Modal ---
    const adModal = document.getElementById('ad-modal');
    const adHeadlineInput = document.getElementById('ad-headline');
    const adDescriptionInput = document.getElementById('ad-description');
    const adUrlInput = document.getElementById('ad-url');
    const previewHeadlineSpan = document.getElementById('preview-headline');
    const previewDescriptionSpan = document.getElementById('preview-description');
    const previewUrlSpan = document.getElementById('preview-url');

    // Function to open modal (globally accessible via onclick)
    window.openAdPreview = () => {
        if (adModal) {
            adModal.style.display = 'flex'; // Need to set display before adding class for transition
            // Use setTimeout to allow the display change to render before starting the transition
            setTimeout(() => {
                adModal.classList.add('show');
            }, 10); // Small delay
        }
    }

    // Function to close modal (globally accessible via onclick)
    window.closeAdPreview = () => {
        if (adModal) {
            adModal.classList.remove('show');
            // Wait for transition to finish before hiding completely
            adModal.addEventListener('transitionend', () => {
                if (!adModal.classList.contains('show')) {
                    adModal.style.display = 'none';
                }
            }, { once: true }); // Remove listener after it runs once
        }
    }

    // Link inputs to preview
    if (adHeadlineInput && previewHeadlineSpan) {
        adHeadlineInput.addEventListener('input', () => previewHeadlineSpan.textContent = adHeadlineInput.value);
    }
    if (adDescriptionInput && previewDescriptionSpan) {
        adDescriptionInput.addEventListener('input', () => previewDescriptionSpan.textContent = adDescriptionInput.value);
    }
    if (adUrlInput && previewUrlSpan) {
        adUrlInput.addEventListener('input', () => previewUrlSpan.textContent = adUrlInput.value);
    }

    // Close modal on background click
    if (adModal) {
        adModal.addEventListener('click', (e) => {
            if (e.target === adModal) {
                closeAdPreview();
            }
        });
    }
     // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape" && adModal && adModal.classList.contains('show')) {
            closeAdPreview();
        }
    });

    // --- KPI Counter Animation (using Anime.js) ---
    // Ensure Anime.js is loaded before this runs
    if (typeof anime === 'function') {
        const animateCounter = (elementId, endValue, decimals = 0, suffix = '') => {
            const element = document.getElementById(elementId);
            if (!element) {
                console.warn(`Element with ID #${elementId} not found for animation.`);
                return;
            }
            anime({
                targets: element,
                innerHTML: [0, endValue],
                round: 10 ** decimals, // Rounds to the specified number of decimal places
                easing: 'easeOutExpo', // A smoother easing function
                duration: 2000,
                update: function(anim) {
                    // Format with commas and add suffix during animation update
                    let currentValue = anim.animations[0].currentValue;
                    element.innerHTML = currentValue.toLocaleString(undefined, {
                        minimumFractionDigits: decimals,
                        maximumFractionDigits: decimals
                    }) + suffix;
                },
                complete: function(anim) {
                     // Ensure the final value is accurately displayed and formatted
                    let finalValue = parseFloat(endValue);
                     element.innerHTML = finalValue.toLocaleString(undefined, {
                        minimumFractionDigits: decimals,
                        maximumFractionDigits: decimals
                    }) + suffix;
                }
            });
        };

        // Animate the KPI counters with updated example values
        animateCounter('kpi-visitors', 1680);
        animateCounter('kpi-reach', 11800);    // Matches FB reach metric example
        animateCounter('kpi-conversions', 100); // Matches budget sim leads example
        animateCounter('kpi-engagement', 4.5, 1, '%'); // Matches IG engagement metric example
    } else {
        console.warn("Anime.js not found. KPI animations disabled.");
        // Optional: Set static initial values if animation library isn't loaded
         const kpiVisitors = document.getElementById('kpi-visitors');
         if (kpiVisitors) kpiVisitors.textContent = '1,680';
         // ... etc. for other KPIs
    }


    // --- Chart.js Initialization ---
    // Ensure Chart.js is loaded
    if (typeof Chart === 'function') {
        const chartFont = "'Inter', sans-serif"; // Match body font

        // Global object to hold chart instances for theme updates
        window.chartInstances = {};

        // Chart Configuration Helpers
        const getChartColors = (darkMode) => {
             // Using CSS Variables defined in style.css
            return darkMode
                ? [getComputedStyle(document.documentElement).getPropertyValue('--secondary-light'), getComputedStyle(document.documentElement).getPropertyValue('--accent'), '#34d399', '#f87171', '#c084fc']
                : [getComputedStyle(document.documentElement).getPropertyValue('--primary'), getComputedStyle(document.documentElement).getPropertyValue('--accent-dark'), '#10b981', '#ef4444', '#a855f7'];
        };

        const getGridColor = (darkMode) => darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
        const getTextColor = (darkMode) => darkMode ? getComputedStyle(document.documentElement).getPropertyValue('--dark-text') : getComputedStyle(document.documentElement).getPropertyValue('--light-text-secondary');

        const getChartOptions = (titleText = '', darkMode) => {
            const textColor = getTextColor(darkMode);
            return {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: { family: chartFont, size: 12 },
                            color: textColor,
                            boxWidth: 12,
                            padding: 20
                        }
                    },
                    tooltip: {
                        backgroundColor: darkMode ? 'var(--dark-card)' : 'var(--light-card)',
                        titleColor: darkMode ? 'var(--dark-text)' : 'var(--light-text)',
                        bodyColor: darkMode ? 'var(--dark-text-secondary)' : 'var(--light-text-secondary)',
                        borderColor: darkMode ? 'var(--dark-border)' : '#e5e7eb', // Gray 200
                        borderWidth: 1,
                        padding: 10,
                        titleFont: { family: chartFont, weight: '600' }, // Changed from 'bold'
                        bodyFont: { family: chartFont },
                        usePointStyle: true, // Use point style in tooltip
                        callbacks: { // Example: Format tooltip values
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += context.parsed.y.toLocaleString();
                                } else if (context.parsed !== null) {
                                     label += context.parsed.toLocaleString(); // For doughnut charts
                                }
                                return label;
                            }
                        }
                    },
                    title: {
                        display: !!titleText,
                        text: titleText,
                        font: { family: chartFont, size: 14, weight: '600' },
                        color: textColor,
                        padding: { top: 10, bottom: 15 }
                    }
                },
                 scales: { // Define common scale options
                    y: {
                        beginAtZero: true,
                        grid: { color: getGridColor(darkMode), drawBorder: false },
                        ticks: { color: textColor, font: { family: chartFont, size: 11 } }
                    },
                    x: {
                        grid: { display: false }, // Hide vertical grid lines generally
                        ticks: { color: textColor, font: { family: chartFont, size: 11 } }
                    }
                 }
            };
        };


        // 1. Website Traffic Chart (Doughnut)
        const webChartCtx = document.getElementById('webChart');
        if (webChartCtx) {
            const webChartDataSets = {
                all: [35, 28, 22, 15], // Direct, Organic, Social, Referral
                direct: [100, 0, 0, 0],
                social: [0, 0, 100, 0],
                organic: [0, 100, 0, 0],
                referral: [0, 0, 0, 100]
            };
            window.chartInstances.webChart = new Chart(webChartCtx.getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: ['Direct', 'Organic Search', 'Social Media', 'Referrals'],
                    datasets: [{
                        data: webChartDataSets.all,
                        backgroundColor: getChartColors(isDarkMode()),
                        borderColor: isDarkMode() ? 'var(--dark-card)' : 'var(--light-card)',
                        borderWidth: 3,
                        hoverOffset: 8
                    }]
                },
                options: {
                    ...getChartOptions('Website Traffic Sources', isDarkMode()),
                    cutout: '65%', // Makes it a doughnut chart
                    scales: {} // Doughnut charts don't use scales
                }
            });
            // Add filter functionality
            const webChartFilter = document.getElementById('web-chart-filter');
             if(webChartFilter){
                webChartFilter.addEventListener('change', (e) => {
                    const filter = e.target.value;
                    const chart = window.chartInstances.webChart;
                    chart.data.datasets[0].data = webChartDataSets[filter] || webChartDataSets.all;
                    const currentColors = getChartColors(isDarkMode());
                    const disabledColor = isDarkMode() ? '#4b5563' : '#e5e7eb'; // Gray-600 / Gray-200

                    if (filter === 'all') {
                        chart.data.datasets[0].backgroundColor = currentColors;
                    } else {
                        const activeIndex = chart.data.labels.findIndex(label => label.toLowerCase().replace(' ','') === filter.toLowerCase().replace(' ',''));
                        chart.data.datasets[0].backgroundColor = currentColors.map((color, index) =>
                            index === activeIndex ? color : disabledColor
                        );
                    }
                    chart.update();
                });
            }
        } else { console.warn("Canvas element for webChart not found."); }

        // 2. Facebook Engagement Chart (Bar)
        const fbChartCtx = document.getElementById('facebookChart');
        if (fbChartCtx) {
            const fbChartDataSets = {
                all: [450, 350, 250, 150, 200], // Likes, Comments, Shares, Clicks, Saves (Example Data)
                photos: [200, 50, 30, 80, 40],
                videos: [150, 150, 100, 50, 100],
                links: [50, 20, 40, 10, 20],
                text: [50, 130, 80, 10, 40]
            };
             window.chartInstances.facebookChart = new Chart(fbChartCtx.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: ['Likes', 'Comments', 'Shares', 'Link Clicks', 'Saves'],
                    datasets: [{
                        label: 'Engagement Count',
                        data: fbChartDataSets.all,
                        backgroundColor: getChartColors(isDarkMode())[0], // Use first color
                        borderColor: getChartColors(isDarkMode())[0],
                        borderWidth: 1,
                        borderRadius: 4,
                        barPercentage: 0.7,
                        categoryPercentage: 0.8
                    }]
                },
                 options: {
                    ...getChartOptions('Facebook Engagement by Type', isDarkMode()),
                    indexAxis: 'y', // Make it a horizontal bar chart for better label readability
                    plugins: { legend: { display: false } },
                    scales: { // Override scales for horizontal bar
                         y: {
                            beginAtZero: true,
                            grid: { display: false }, // Hide horizontal grid lines
                            ticks: { color: getTextColor(isDarkMode()), font: { family: chartFont, size: 11 }}
                         },
                        x: {
                            grid: { color: getGridColor(isDarkMode()), drawBorder: false },
                            ticks: { color: getTextColor(isDarkMode()), font: { family: chartFont, size: 11 }},
                            title: {
                                display: true,
                                text: 'Engagement Count',
                                color: getTextColor(isDarkMode()),
                                font: { family: chartFont, size: 12, weight: '500' }
                            }
                        }
                     }
                }
            });
            // Filter functionality
             const fbChartFilter = document.getElementById('fb-chart-filter');
              if(fbChartFilter){
                  fbChartFilter.addEventListener('change', (e) => {
                    const chart = window.chartInstances.facebookChart;
                    chart.data.datasets[0].data = fbChartDataSets[e.target.value] || fbChartDataSets.all;
                    chart.update();
                  });
              }
        } else { console.warn("Canvas element for facebookChart not found."); }

        // 3. Instagram Follower Growth Chart (Line)
        const igChartCtx = document.getElementById('instagramChart');
         if (igChartCtx) {
            window.chartInstances.instagramChart = new Chart(igChartCtx.getContext('2d'), {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'], // Example months
                    datasets: [{
                        label: 'Followers',
                        data: [200, 250, 310, 400, 550, 680, 765, 850], // Example growth data
                        borderColor: getChartColors(isDarkMode())[1], // Use second color (accent)
                        backgroundColor: getChartColors(isDarkMode())[1] + '33', // Semi-transparent fill
                        fill: true,
                        tension: 0.4, // Smoother line
                        pointRadius: 4,
                        pointBackgroundColor: getChartColors(isDarkMode())[1],
                        pointHoverRadius: 6,
                        borderWidth: 2,
                    }]
                },
                options: {
                    ...getChartOptions('Instagram Follower Growth', isDarkMode()),
                    plugins: { legend: { display: false } },
                     scales: { y: { title: { display: true, text: 'Total Followers', color: getTextColor(isDarkMode()), font: { family: chartFont, size: 12, weight: '500' }} } }
                }
            });
        } else { console.warn("Canvas element for instagramChart not found."); }

        // 4. YouTube Views Chart (Line)
        const ytChartCtx = document.getElementById('youtubeChart');
         if (ytChartCtx) {
            window.chartInstances.youtubeChart = new Chart(ytChartCtx.getContext('2d'), {
                type: 'line',
                 data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'], // Example months
                    datasets: [{
                        label: 'Monthly Views',
                        data: [500, 800, 1200, 1100, 1500, 1800, 2200, 2100], // Example view data
                        borderColor: getChartColors(isDarkMode())[2], // Use third color (success)
                        backgroundColor: getChartColors(isDarkMode())[2] + '33',
                        fill: true,
                        tension: 0.4,
                        pointRadius: 4,
                        pointBackgroundColor: getChartColors(isDarkMode())[2],
                        pointHoverRadius: 6,
                         borderWidth: 2,
                    }]
                },
                options: {
                    ...getChartOptions('YouTube Monthly Views', isDarkMode()),
                    plugins: { legend: { display: false } },
                     scales: { y: { title: { display: true, text: 'Views', color: getTextColor(isDarkMode()), font: { family: chartFont, size: 12, weight: '500' }} } }
                }
            });
        } else { console.warn("Canvas element for youtubeChart not found."); }

        // --- Global Theme Update Function for Charts ---
        window.updateChartThemes = () => {
            if (typeof Chart === 'undefined' || !window.chartInstances) return;

            const darkMode = isDarkMode();
            const newColors = getChartColors(darkMode);
            const gridColor = getGridColor(darkMode);
            const textColor = getTextColor(darkMode);
            const cardBgColor = darkMode ? 'var(--dark-card)' : 'var(--light-card)';

            Object.values(window.chartInstances).forEach((chart) => {
                 // Update dataset colors dynamically
                chart.data.datasets.forEach((dataset, index) => {
                    const colorIndex = index % newColors.length; // Cycle through colors if needed
                    if(dataset.borderColor) dataset.borderColor = (chart.config.type === 'doughnut') ? cardBgColor : newColors[colorIndex];
                    if(dataset.backgroundColor){
                         // Handle single color (bars), array (doughnut), or gradient/pattern (not used here)
                        if (chart.config.type === 'doughnut') {
                            // Need to handle the filtering state
                            const filterElement = document.getElementById('web-chart-filter'); // Assuming only web chart has this filter
                            const currentFilter = filterElement ? filterElement.value : 'all';
                            if(currentFilter === 'all'){
                                dataset.backgroundColor = newColors;
                            } else {
                                // Re-apply filter logic colors
                                const disabledColor = darkMode ? '#4b5563' : '#e5e7eb';
                                const activeIndex = chart.data.labels.findIndex(label => label.toLowerCase().replace(' ','') === currentFilter.toLowerCase().replace(' ',''));
                                dataset.backgroundColor = newColors.map((color, i) =>
                                    i === activeIndex ? color : disabledColor
                                );
                            }

                        } else if(chart.config.type === 'line'){
                             dataset.backgroundColor = newColors[colorIndex] + '33'; // Apply transparency for fills
                        } else {
                             dataset.backgroundColor = newColors[colorIndex];
                        }
                    }
                    if(dataset.pointBackgroundColor) dataset.pointBackgroundColor = newColors[colorIndex];
                });

                 // Update Options (legend, tooltips, scales, titles)
                const chartOptions = chart.options;
                if(chartOptions.plugins){
                    if(chartOptions.plugins.legend) chartOptions.plugins.legend.labels.color = textColor;
                    if(chartOptions.plugins.title) chartOptions.plugins.title.color = textColor;
                    if(chartOptions.plugins.tooltip) {
                        chartOptions.plugins.tooltip.backgroundColor = cardBgColor; // Use var direct from CSS
                        chartOptions.plugins.tooltip.titleColor = darkMode ? 'var(--dark-text)' : 'var(--light-text)';
                        chartOptions.plugins.tooltip.bodyColor = darkMode ? 'var(--dark-text-secondary)' : 'var(--light-text-secondary)';
                        chartOptions.plugins.tooltip.borderColor = darkMode ? 'var(--dark-border)' : '#e5e7eb';
                    }
                }
                 if (chartOptions.scales) {
                    Object.values(chartOptions.scales).forEach(scale => {
                        if (scale.grid) { scale.grid.color = gridColor; }
                        if (scale.ticks) { scale.ticks.color = textColor; }
                         if (scale.title) { scale.title.color = textColor; }
                    });
                }

                chart.update('none'); // Update without animation for theme change
            });
        };

    } else {
        console.warn("Chart.js not found. Charts disabled.");
    }


    // --- AI Chatbot ---
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSendButton = document.getElementById('chatbot-send');
    const chatbotContainer = document.getElementById('chatbot-container');

    // More sophisticated responses (still hardcoded for example)
     const chatbotResponses = {
      greetings: ["Hello! How can I assist with your marketing strategy today?", "Hi there! What marketing insights can I provide?", "Welcome! Ask me about analytics, campaigns, or generators."],
      "price.*(generator|\\d+kva)|cost.*(generator|\\d+kva)": (msg) => {
          const kvaMatch = msg.match(/(\d+)\s*kva/i);
          const kva = kvaMatch ? kvaMatch[1] : 'standard';
          // Super simple pricing estimate - replace with real logic/API call
          const basePrice = 15000;
          const estimatedPrice = kva === 'standard' ? "Varies, please specify kVA" : `Around BDT ${(basePrice * (parseInt(kva) || 100)).toLocaleString()}`;
          return `Pricing for a ${kva}kVA Forest City Generator ${kva === 'standard' ? 'varies' : `typically starts ${estimatedPrice}`}, depending on specific configuration and accessories. For an accurate price, requesting a formal quote is best.`;
      },
      "quote|request quote|formal quote|get quote": "Understood. To generate an accurate quote, our sales team needs your contact details and specific requirements. Please use the contact form on the website or call us directly during business hours.",
      "service|maintenance|repair": "Yes, we provide comprehensive maintenance packages and on-call repair services for Forest City generators. We recommend scheduled maintenance for optimal performance. Would you like details on our standard service plans?",
      "schedule.*(service|maintenance)|book.*appointment": "To schedule service, the quickest way is to call our dedicated support line at [Your Service Number Here] or fill out the online service request form on the 'Support' section of our website. Please have your generator model and serial number handy if possible.",
      "generator.*(types|models|options|range)": "We specialize in reliable Forest City diesel generators, typically offering models ranging from 50kVA up to 500kVA, suitable for various industrial and commercial applications. Do you have a specific power requirement (kVA) or application in mind?",
      "facebook.*(post|content).*(idea|suggestion)": ["How about a 'Client Spotlight' post? Feature a recent installation with a brief testimonial and a high-quality photo.", "Consider a short video demonstrating a key feature, like the automatic transfer switch.", "A 'Tip Tuesday' post about basic generator maintenance could be engaging for owners."],
      "(website|improve|optimize).*(bounce rate|load speed|seo)": ["To improve bounce rate, focus on: 1. Page Load Speed (aim under 3s). 2. Clear Headline/Value Proposition Above-the-Fold. 3. Mobile Responsiveness. 4. Engaging Content relevant to the traffic source. For SEO, ensure relevant keywords are in titles, headings, and content, plus implement Schema markup.", "Let's look at the website analytics tab. High bounce rate often correlates with slow load times or mismatched user intent. Consider optimizing images and implementing caching. For SEO, focusing on local keywords like 'generator service Dhaka' could be beneficial."],
      "analyze.*(instagram|facebook|youtube|social media)": (msg) => {
            const platformMatch = msg.match(/(instagram|facebook|youtube|social media)/i);
            const platform = platformMatch ? platformMatch[1] : 'social media';
            return `Okay, analyzing ${platform} performance. Key metrics usually include Reach, Engagement Rate (likes+comments+shares / reach), Follower Growth, Click-Through Rate (for ads/links), and for video: Average View Duration. We can look at the specific ${platform} tab for the data we have here. What aspect are you most interested in?`;
      },
      thank: ["You're welcome!", "Happy to help!", "Anytime!", "Glad I could assist."],
      default: ["That's an interesting point. Could you elaborate or ask a more specific question about marketing analytics, campaign strategy, or our generator products?", "I understand you're asking about that, but my capabilities are focused on marketing data and basic product info. Could you try rephrasing?", "I'm still learning. Can you ask that in a different way?"]
    };

    // Function to get a random response from an array
    const getRandomResponse = (responsesArray) => responsesArray[Math.floor(Math.random() * responsesArray.length)];

    // Add chat message to the UI
    function addChatMessage(message, sender) {
        if (!chatbotContainer) return;
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chat-message', sender);
        // Basic sanitization - replace potential HTML tags
        messageDiv.textContent = message; // Keep it simple, no complex HTML injection
        chatbotContainer.appendChild(messageDiv);
        // Scroll to the bottom smoothly
        chatbotContainer.scrollTo({ top: chatbotContainer.scrollHeight, behavior: 'smooth' });
    }

    // Get chatbot response based on input
     function getChatbotResponse(userMessage) {
        const cleanedMessage = userMessage.toLowerCase().trim();

        // Handle simple greetings and thanks first
        if (/\b(hello|hi|hey|hola|hallo)\b/i.test(cleanedMessage)) {
             return getRandomResponse(chatbotResponses.greetings);
        }
        if (/\b(thanks|thank you|cheers|ok thanks)\b/i.test(cleanedMessage)) {
            return getRandomResponse(chatbotResponses.thank);
        }

        // Iterate through regex patterns
        for (const pattern in chatbotResponses) {
             if (typeof chatbotResponses[pattern] === 'function' || pattern === 'greetings' || pattern === 'thank' || pattern === 'default') continue; // Skip functions/arrays handled elsewhere

             try {
                const regex = new RegExp(pattern, 'i');
                if (regex.test(cleanedMessage)) {
                    // If response is an array, pick one randomly
                     if (Array.isArray(chatbotResponses[pattern])) {
                        return getRandomResponse(chatbotResponses[pattern]);
                     }
                     return chatbotResponses[pattern]; // Return simple string response
                }
             } catch (e) {
                console.error("Regex error for pattern:", pattern, e);
            }
        }

         // Iterate through function patterns (require message context)
        for (const pattern in chatbotResponses) {
             if (typeof chatbotResponses[pattern] !== 'function') continue;
              try {
                 const regex = new RegExp(pattern, 'i');
                 if (regex.test(cleanedMessage)) {
                    return chatbotResponses[pattern](cleanedMessage); // Call function with message
                }
             } catch (e) {
                console.error("Regex error for pattern:", pattern, e);
             }
        }

        // Default fallback
        return getRandomResponse(chatbotResponses.default);
    }

    // Handle sending a chat message
    const handleChatSend = () => {
        if (!chatbotInput || !chatbotSendButton) return;

        const userMessage = chatbotInput.value.trim();
        if (userMessage) {
            addChatMessage(userMessage, 'user');
            chatbotInput.value = ''; // Clear input
            chatbotInput.disabled = true;
            chatbotSendButton.disabled = true;
            chatbotSendButton.classList.add('opacity-50'); // Visual cue

            // Simulate bot thinking time
            setTimeout(() => {
                const botResponse = getChatbotResponse(userMessage);
                addChatMessage(botResponse, 'bot');
                chatbotInput.disabled = false; // Re-enable
                chatbotSendButton.disabled = false;
                 chatbotSendButton.classList.remove('opacity-50');
                chatbotInput.focus(); // Focus back to input
            }, 700 + Math.random() * 500); // Simulate 0.7-1.2 second delay
        }
    };

    // Attach event listeners
    if (chatbotSendButton) chatbotSendButton.addEventListener('click', handleChatSend);
    if (chatbotInput) {
        chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); // Prevent potential form submission
                handleChatSend();
            }
        });
    }


    // --- Live Chat Widget ---
    const liveChatButton = document.getElementById('live-chat');
    if (liveChatButton) {
        liveChatButton.addEventListener('click', () => {
            // In a real application, this would initiate connection to a live chat service
            // For this demo, we just show an alert or add a chatbot message.
            alert('Live Chat initiated! Connecting you to a support agent...');
            // Or potentially add a message to the chatbot interface:
            // addChatMessage("Connecting you to a live support agent. Please wait.", 'bot');
        });
    }

    // --- Back to Top Button ---
    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
        const scrollThreshold = 400; // Pixels to scroll before showing button

        window.addEventListener('scroll', () => {
            if (window.scrollY > scrollThreshold) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        }, { passive: true }); // Use passive listener for better scroll performance

        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent potential hash jump if it were an anchor
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Export Report ---
    const exportButton = document.getElementById('export-report');
    if (exportButton && typeof html2pdf === 'function') { // Check if library is loaded
        exportButton.addEventListener('click', () => {
            const mainElement = document.querySelector('main');
            if (!mainElement) {
                alert('Error: Could not find main content to export.');
                return;
            }

            exportButton.disabled = true; // Prevent multiple clicks
            exportButton.textContent = 'Generating...';

            const options = {
                margin: [0.5, 0.5, 0.8, 0.5], // Margins: [Top, Left, Bottom, Right] in inches
                filename: `Mektronicsgroup_Marketing_Report_${new Date().toISOString().split('T')[0]}.pdf`,
                image: { type: 'jpeg', quality: 0.95 }, // Image quality
                html2canvas: {
                    scale: 2, // Higher scale for better resolution
                    useCORS: true, // Enable cross-origin images if any
                    logging: false, // Disable html2canvas console logs
                    // Attempt to wait for images/fonts, though might not be foolproof
                    // AllowTaint: true // May be needed sometimes, use with caution
                },
                jsPDF: {
                    unit: 'in',
                    format: 'letter', // Standard letter size
                    orientation: 'portrait'
                },
                // Try to avoid breaking elements across pages where possible
                 pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
            };

            html2pdf().set(options).from(mainElement).save()
                .catch(err => {
                    console.error("PDF Export Error:", err);
                    alert('Sorry, there was an error generating the PDF report.');
                })
                .then(() => {
                    console.log("PDF Export finished.");
                    // Optional: Show a success message briefly
                })
                .finally(() => {
                    exportButton.disabled = false; // Re-enable button
                    exportButton.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                           <path fill-rule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clip-rule="evenodd" />
                        </svg>
                        <span>Export as PDF</span>`;
                });
        });
    } else if (exportButton) {
        console.warn("html2pdf.js library not found. Export functionality disabled.");
        exportButton.disabled = true;
        exportButton.title = "PDF Export library not loaded";
    }

    // --- Footer Year ---
    const footerYearSpan = document.getElementById('footer-year');
    if (footerYearSpan) {
        footerYearSpan.textContent = new Date().getFullYear();
    }

    // --- Add any other initialization code here ---
    console.log("Mektronics Dashboard Initialized!");














}); // End DOMContentLoaded