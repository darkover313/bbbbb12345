// app.js - الملف الرئيسي المعدل
document.addEventListener('DOMContentLoaded', function() {
    // تبديل بين تسجيل الدخول وإنشاء حساب
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (loginTab && registerTab) {
        loginTab.addEventListener('click', () => {
            loginTab.classList.add('active');
            registerTab.classList.remove('active');
            loginForm.classList.add('active');
            registerForm.classList.remove('active');
        });
        
        registerTab.addEventListener('click', () => {
            registerTab.classList.add('active');
            loginTab.classList.remove('active');
            registerForm.classList.add('active');
            loginForm.classList.remove('active');
        });
    }
    
    // التحقق من تطابق كلمات المرور
    const registerPassword = document.getElementById('register-password');
    const confirmPassword = document.getElementById('register-confirm-password');
    
    if (confirmPassword) {
        confirmPassword.addEventListener('input', function() {
            if (registerPassword.value !== confirmPassword.value) {
                this.style.borderColor = 'var(--danger-color)';
            } else {
                this.style.borderColor = 'var(--secondary-color)';
            }
        });
    }
    
    // معالجة تسجيل الدخول
    const loginFormElement = document.getElementById('login-form');
    if (loginFormElement) {
        loginFormElement.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            console.log('تسجيل الدخول:', { email, password });
            alert('تم تسجيل الدخول بنجاح! سيتم توجيهك إلى لوحة التحكم.');
            window.location.href = 'dashboard.html';
        });
    }
    
    // معالجة إنشاء حساب
    const registerFormElement = document.getElementById('register-form');
    if (registerFormElement) {
        registerFormElement.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const phone = document.getElementById('register-phone').value;
            const password = document.getElementById('register-password').value;
            const isRealtor = document.getElementById('user-type').checked;
            
            if (password !== document.getElementById('register-confirm-password').value) {
                alert('كلمات المرور غير متطابقة!');
                return;
            }
            
            console.log('إنشاء حساب:', { name, email, phone, password, isRealtor });
            alert('تم إنشاء حسابك بنجاح! يمكنك الآن تسجيل الدخول.');
            loginTab.click();
        });
    }
    
    // التحكم في شريط الأسعار
    const priceSlider = document.getElementById('price-slider');
    const currentPrice = document.getElementById('current-price');
    
    if (priceSlider && currentPrice) {
        priceSlider.addEventListener('input', function() {
            const value = parseInt(this.value);
            currentPrice.textContent = value.toLocaleString();
        });
    }
    
    // التحكم في فلاتر الغرف
    const roomButtons = document.querySelectorAll('.room-btn');
    roomButtons.forEach(button => {
        button.addEventListener('click', function() {
            roomButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // إدارة القوائم المنسدلة للمستخدم
    const userDropdowns = document.querySelectorAll('.user-dropdown');
    userDropdowns.forEach(dropdown => {
        const btn = dropdown.querySelector('.user-btn');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        if (btn && menu) {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
            });
            
            document.addEventListener('click', () => {
                menu.style.display = 'none';
            });
        }
    });
    
    // إضافة رسوم متحركة للبطاقات
    const cards = document.querySelectorAll('.card, .property-card, .action-btn');
    cards.forEach(card => {
        card.classList.add('fade-in');
    });
    
    // تحميل عقارات عينة
    if (window.location.pathname.includes('dashboard.html')) {
        loadSampleProperties();
    }
    
    // إعداد قائمة العقارات القابلة للإخفاء
    setupSidebarToggle();
    
    // إضافة زر عرض القائمة على الجوال
    addMobileSidebarToggle();
    
    // إضافة زر إخفاء القائمة
    addHideSidebarButton();
    
    // إعداد أحداث إغلاق النوافذ
    setupCloseEvents();
});

// إعداد قائمة العقارات القابلة للإخفاء
function setupSidebarToggle() {
    const sidebar = document.querySelector('.properties-sidebar');
    const toggleBtn = document.querySelector('.sidebar-toggle');
    const closeBtn = document.querySelector('.close-sidebar');
    
    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            sidebar.classList.toggle('collapsed');
            this.classList.toggle('collapsed');
            
            const icon = this.querySelector('i');
            if (sidebar.classList.contains('collapsed')) {
                icon.className = 'fas fa-chevron-right';
            } else {
                icon.className = 'fas fa-chevron-left';
            }
            
            // تحديث الخريطة
            setTimeout(() => {
                if (window.map) {
                    window.map.invalidateSize();
                }
            }, 300);
        });
    }
    
    if (closeBtn && sidebar) {
        closeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            sidebar.classList.remove('show');
        });
    }
    
    // إغلاق القائمة عند النقر خارجها (للجوال)
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            const sidebar = document.querySelector('.properties-sidebar');
            const sidebarToggle = document.querySelector('.mobile-sidebar-toggle');
            
            if (sidebar && sidebar.classList.contains('show') && 
                !sidebar.contains(e.target) && 
                !sidebarToggle?.contains(e.target)) {
                sidebar.classList.remove('show');
            }
        }
    });
}

// إضافة زر عرض/إخفاء القائمة للجوال
function addMobileSidebarToggle() {
    if (window.innerWidth <= 768) {
        const mapHeader = document.querySelector('.map-header');
        if (mapHeader && !document.getElementById('mobile-sidebar-toggle')) {
            // إنشاء زر جديد
            const sidebarToggle = document.createElement('button');
            sidebarToggle.id = 'mobile-sidebar-toggle';
            sidebarToggle.className = 'mobile-sidebar-toggle';
            sidebarToggle.innerHTML = '<i class="fas fa-list"></i> عرض القائمة';
            
            sidebarToggle.addEventListener('click', function(e) {
                e.stopPropagation();
                const sidebar = document.querySelector('.properties-sidebar');
                if (sidebar) {
                    sidebar.classList.add('show');
                }
            });
            
            const mapControls = document.querySelector('.map-controls');
            if (mapControls) {
                mapControls.appendChild(sidebarToggle);
            }
        }
    }
}

// إضافة زر إخفاء القائمة
function addHideSidebarButton() {
    const sidebarHeader = document.querySelector('.sidebar-header');
    if (sidebarHeader && !document.getElementById('hide-sidebar')) {
        const hideBtn = document.createElement('button');
        hideBtn.id = 'hide-sidebar';
        hideBtn.className = 'hide-sidebar-btn';
        hideBtn.innerHTML = '<i class="fas fa-times"></i>';
        hideBtn.title = 'إخفاء القائمة';
        
        hideBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const sidebar = document.querySelector('.properties-sidebar');
            if (sidebar) {
                sidebar.classList.add('collapsed');
                const toggleBtn = document.querySelector('.sidebar-toggle');
                if (toggleBtn) {
                    toggleBtn.classList.add('collapsed');
                    const icon = toggleBtn.querySelector('i');
                    if (icon) {
                        icon.className = 'fas fa-chevron-right';
                    }
                }
            }
        });
        
        const sidebarActions = sidebarHeader.querySelector('.sidebar-actions');
        if (sidebarActions) {
            sidebarActions.appendChild(hideBtn);
        }
    }
}

// تحميل عقارات عينة
function loadSampleProperties() {
    const properties = [
        {
            id: 1,
            title: "فيلا فاخرة في الرياض",
            location: "حي النخيل، الرياض",
            price: "1,250,000 ريال",
            rooms: 5,
            baths: 4,
            area: "450 م²",
            image: "assets/property1.jpg",
            status: "للبيع"
        },
        {
            id: 2,
            title: "شقة حديثة في جدة",
            location: "حي الصفا، جدة",
            price: "850,000 ريال",
            rooms: 3,
            baths: 2,
            area: "180 م²",
            image: "assets/property2.jpg",
            status: "للبيع"
        }
    ];
    
    console.log('العقارات المحملة:', properties);
}

// حفظ العقار في المفضلة
function toggleFavorite(btn) {
    const icon = btn.querySelector('i');
    if (icon.classList.contains('far')) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        btn.style.color = 'var(--danger-color)';
        alert('تم إضافة العقار إلى المفضلة');
    } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
        btn.style.color = '';
        alert('تم إزالة العقار من المفضلة');
    }
}

// فتح نافذة العقار
function openPropertyPopup(property) {
    const popup = document.getElementById('property-popup');
    if (!popup) return;
    
    updatePropertyPopupContent(property);
    
    popup.style.display = 'block';
    
    // إضافة حدث لإغلاق النافذة عند النقر خارجها
    setTimeout(() => {
        document.addEventListener('click', closePopupOnClickOutside, true);
    }, 100);
}

// تحديث محتوى نافذة العقار
function updatePropertyPopupContent(property) {
    const popup = document.getElementById('property-popup');
    if (!popup) return;
    
    const title = popup.querySelector('h3');
    const price = popup.querySelector('.popup-price');
    const image = popup.querySelector('.popup-image img');
    const details = popup.querySelector('.popup-details');
    const address = popup.querySelector('.popup-address');
    const detailsBtn = popup.querySelector('.btn-primary');
    
    if (title) title.textContent = property.title;
    if (price) price.textContent = property.price;
    if (image) image.src = property.image;
    if (address) address.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${property.address}`;
    
    if (details) {
        details.innerHTML = `
            ${property.rooms ? `<span><i class="fas fa-bed"></i> ${property.rooms} غرف</span>` : ''}
            ${property.baths ? `<span><i class="fas fa-bath"></i> ${property.baths} حمامات</span>` : ''}
            ${property.area ? `<span><i class="fas fa-ruler-combined"></i> ${property.area}</span>` : ''}
        `;
    }
    
    if (detailsBtn) {
        detailsBtn.href = `property.html?id=${property.id}`;
    }
}

// إغلاق نافذة العقار
function closePropertyPopup() {
    const popup = document.getElementById('property-popup');
    if (popup) {
        popup.style.display = 'none';
        document.removeEventListener('click', closePopupOnClickOutside, true);
    }
}

// إغلاق النافذة عند النقر خارجها
function closePopupOnClickOutside(e) {
    const popup = document.getElementById('property-popup');
    const closeBtn = document.querySelector('.close-popup');
    
    if (popup && !popup.contains(e.target) && !closeBtn?.contains(e.target)) {
        closePropertyPopup();
    }
}

// إعداد أحداث الإغلاق
function setupCloseEvents() {
    // إضافة حدث لإغلاق نافذة العقار بزر الإغلاق
    const closePopupBtn = document.querySelector('.close-popup');
    if (closePopupBtn) {
        closePopupBtn.addEventListener('click', closePropertyPopup);
    }
    
    // إضافة حدث لإغلاق النوافذ المودالية
    const closeModalBtns = document.querySelectorAll('.close-modal');
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal-overlay');
            if (modal) {
                modal.remove();
            }
        });
    });
}

// إضافة إلى المفضلة
function addToFavorites(propertyId) {
    console.log('إضافة العقار إلى المفضلة:', propertyId);
    alert('تم إضافة العقار إلى المفضلة');
}

// إعادة الحجم عند تغيير حجم النافذة
window.addEventListener('resize', function() {
    addMobileSidebarToggle();
});

// دعم إعادة الحجم للخريطة
window.addEventListener('orientationchange', function() {
    setTimeout(() => {
        if (window.map) {
            window.map.invalidateSize();
        }
    }, 300);
});