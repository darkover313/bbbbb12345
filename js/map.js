// map.js - الخريطة مع العلامات المربعة
let map = null;
let propertyMarkers = [];
let properties = [];

// تهيئة الخريطة
function initMap() {
    // إحداثيات افتراضية (الرياض)
    const defaultLat = 24.7136;
    const defaultLng = 46.6753;
    const defaultZoom = 12;
    
    // إنشاء الخريطة
    map = L.map('map').setView([defaultLat, defaultLng], defaultZoom);
    window.map = map;
    
    // إضافة طبقة الخريطة
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
    }).addTo(map);
    
    // تحميل بيانات العقارات
    loadPropertiesData();
    
    // إضافة عناصر التحكم
    addMapControls();
    
    // إعداد أحداث الخريطة
    setupMapEvents();
    
    return map;
}

// تحميل بيانات العقارات
function loadPropertiesData() {
    properties = [
        {
            id: 1,
            lat: 24.7136,
            lng: 46.6753,
            title: "فيلا فاخرة في حي النخيل",
            price: "1,250,000 ريال",
            type: "villa",
            image: "assets/property1.jpg",
            rooms: 5,
            baths: 4,
            area: "450 م²",
            address: "حي النخيل، الرياض، المملكة العربية السعودية",
            description: "فيلا فاخرة مكونة من دورين مع حديقة وبركة سباحة"
        },
        {
            id: 2,
            lat: 24.7236,
            lng: 46.6853,
            title: "شقة حديثة للبيع",
            price: "850,000 ريال",
            type: "apartment",
            image: "assets/property2.jpg",
            rooms: 3,
            baths: 2,
            area: "180 م²",
            address: "حي الصفا، جدة",
            description: "شقة حديثة في برج سكني مع إطلالة رائعة على البحر"
        },
        {
            id: 3,
            lat: 24.7036,
            lng: 46.6653,
            title: "أرض سكنية",
            price: "2,500,000 ريال",
            type: "land",
            image: "assets/property3.jpg",
            area: "800 م²",
            address: "حي الياسمين، الرياض",
            description: "أرض سكنية في موقع مميز صالحة للبناء الفوري"
        },
        {
            id: 4,
            lat: 24.7336,
            lng: 46.6953,
            title: "عمارة سكنية",
            price: "3,500,000 ريال",
            type: "building",
            image: "assets/property4.jpg",
            rooms: 12,
            baths: 12,
            area: "1200 م²",
            address: "حي العليا، الرياض",
            description: "عمارة سكنية مكونة من 4 شقق فاخرة"
        }
    ];
    
    // إضافة العلامات للخريطة
    addPropertyMarkers();
    
    // تحديث قائمة العقارات
    updatePropertiesList();
    
    // تحديث عدد النتائج
    updateResultsCount(properties.length);
}

// إضافة علامات العقارات المربعة مع الذيل
function addPropertyMarkers() {
    // إزالة العلامات القديمة
    propertyMarkers.forEach(marker => {
        map.removeLayer(marker);
    });
    propertyMarkers = [];
    
    // إضافة علامات جديدة
    properties.forEach(property => {
        const markerIcon = L.divIcon({
            className: 'property-marker-new',
            html: `
                <div class="marker-body">
                    <span class="for-sale-label">للبيع</span>
                </div>
                <div class="marker-tail"></div>
            `,
            iconSize: [40, 50],
            iconAnchor: [20, 45],
            popupAnchor: [0, -45]
        });
        
        const marker = L.marker([property.lat, property.lng], {
            icon: markerIcon,
            title: property.title
        }).addTo(map);
        
        // إضافة نافذة منبثقة
        marker.bindPopup(createPropertyPopup(property));
        
        // أحداث العلامة
        marker.on('click', function(e) {
            e.originalEvent.stopPropagation();
            selectPropertyOnMap(property);
        });
        
        property.marker = marker;
        propertyMarkers.push(marker);
    });
}

// إنشاء نافذة منبثقة للعقار
function createPropertyPopup(property) {
    return `
        <div class="leaflet-popup-content" style="text-align: right; direction: rtl; width: 250px;">
            <div style="position: relative;">
                <img src="${property.image}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 4px; margin-bottom: 10px;">
                <div style="position: absolute; top: 10px; right: 10px; background: #ef4444; color: white; padding: 3px 10px; border-radius: 4px; font-size: 12px; font-weight: bold;">
                    للبيع
                </div>
            </div>
            <h4 style="margin: 0 0 10px 0; color: #1f2937;">${property.title}</h4>
            <p style="color: #2563eb; font-weight: bold; margin: 5px 0; font-size: 18px;">${property.price}</p>
            <div style="display: flex; gap: 10px; margin: 10px 0; color: #6b7280; font-size: 14px;">
                ${property.rooms ? `<span><i class="fas fa-bed"></i> ${property.rooms}</span>` : ''}
                ${property.baths ? `<span><i class="fas fa-bath"></i> ${property.baths}</span>` : ''}
                ${property.area ? `<span><i class="fas fa-ruler-combined"></i> ${property.area}</span>` : ''}
            </div>
            <p style="font-size: 12px; color: #6b7280; margin: 5px 0;">
                <i class="fas fa-map-marker-alt"></i> ${property.address}
            </p>
            <button onclick="openPropertyDetails(${property.id})" style="background: #2563eb; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; width: 100%; margin-top: 10px;">
                <i class="fas fa-info-circle"></i> عرض التفاصيل
            </button>
        </div>
    `;
}

// تحديث قائمة العقارات
function updatePropertiesList() {
    const propertiesList = document.querySelector('.properties-list');
    if (!propertiesList) return;
    
    propertiesList.innerHTML = '';
    
    properties.forEach(property => {
        const propertyCard = createPropertyCard(property);
        propertiesList.appendChild(propertyCard);
    });
}

// إنشاء بطاقة عقار
function createPropertyCard(property) {
    const card = document.createElement('div');
    card.className = 'property-card';
    card.setAttribute('data-id', property.id);
    
    card.innerHTML = `
        <div class="property-card-badge">للبيع</div>
        <div class="property-card-image">
            <img src="${property.image}" alt="${property.title}">
            <div class="property-card-overlay">
                <div class="overlay-price">${property.price}</div>
                <div class="overlay-location">
                    <i class="fas fa-map-marker-alt"></i> ${property.address.split('،')[0]}
                </div>
            </div>
        </div>
        <div class="property-card-info">
            <h3 class="property-card-title">${property.title}</h3>
            <div class="property-card-details">
                ${property.rooms ? `
                <div class="detail-item">
                    <div class="detail-icon">
                        <i class="fas fa-bed"></i>
                    </div>
                    <div class="detail-label">غرف</div>
                    <div class="detail-value">${property.rooms}</div>
                </div>
                ` : ''}
                ${property.baths ? `
                <div class="detail-item">
                    <div class="detail-icon">
                        <i class="fas fa-bath"></i>
                    </div>
                    <div class="detail-label">حمامات</div>
                    <div class="detail-value">${property.baths}</div>
                </div>
                ` : ''}
                ${property.area ? `
                <div class="detail-item">
                    <div class="detail-icon">
                        <i class="fas fa-ruler-combined"></i>
                    </div>
                    <div class="detail-label">المساحة</div>
                    <div class="detail-value">${property.area}</div>
                </div>
                ` : ''}
            </div>
            <div class="property-card-footer">
                <span class="property-card-date">منذ ${Math.floor(Math.random() * 7) + 1} أيام</span>
                <a href="property.html?id=${property.id}" class="view-details-btn">
                    التفاصيل <i class="fas fa-arrow-left"></i>
                </a>
            </div>
        </div>
    `;
    
    // إضافة حدث النقر
    card.addEventListener('click', function(e) {
        e.stopPropagation();
        selectPropertyOnList(property);
    });
    
    return card;
}

// اختيار عقار على الخريطة
function selectPropertyOnMap(property) {
    // التمرير إلى العقار
    map.setView([property.lat, property.lng], 15);
    
    // إبراز العلامة
    if (property.marker) {
        property.marker.openPopup();
    }
    
    // إبراز البطاقة في القائمة
    highlightPropertyCard(property.id);
    
    // فتح نافذة التفاصيل
    openPropertyPopup(property);
}

// اختيار عقار من القائمة
function selectPropertyOnList(property) {
    // التمرير إلى العقار على الخريطة
    map.setView([property.lat, property.lng], 15);
    
    // إبراز العلامة
    if (property.marker) {
        property.marker.openPopup();
    }
    
    // إبراز البطاقة
    highlightPropertyCard(property.id);
    
    // فتح نافذة التفاصيل
    openPropertyPopup(property);
}

// إبراز بطاقة العقار
function highlightPropertyCard(propertyId) {
    // إزالة الإبراز السابق
    document.querySelectorAll('.property-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // إضافة الإبراز الجديد
    const card = document.querySelector(`.property-card[data-id="${propertyId}"]`);
    if (card) {
        card.classList.add('selected');
        
        // التأكد من أن البطاقة مرئية
        const sidebar = document.querySelector('.properties-sidebar');
        if (sidebar && sidebar.classList.contains('collapsed')) {
            sidebar.classList.remove('collapsed');
            const toggleBtn = document.querySelector('.sidebar-toggle');
            if (toggleBtn) {
                toggleBtn.classList.remove('collapsed');
                const icon = toggleBtn.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-chevron-left';
                }
            }
        }
        
        // التمرير إلى البطاقة
        setTimeout(() => {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
    }
}

// إضافة عناصر التحكم إلى الخريطة
function addMapControls() {
    // زر تحديد موقعي
    const myLocationBtn = document.getElementById('my-location');
    if (myLocationBtn) {
        myLocationBtn.addEventListener('click', function() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    map.setView([position.coords.latitude, position.coords.longitude], 15);
                    
                    // إضافة علامة للموقع الحالي
                    const locationIcon = L.divIcon({
                        className: 'current-location-marker',
                        html: `
                            <div class="current-location">
                                <div class="location-pin"></div>
                                <div class="location-pulse"></div>
                            </div>
                        `,
                        iconSize: [50, 50],
                        iconAnchor: [25, 25]
                    });
                    
                    L.marker([position.coords.latitude, position.coords.longitude], {
                        icon: locationIcon
                    })
                    .addTo(map)
                    .bindPopup('موقعك الحالي')
                    .openPopup();
                });
            } else {
                alert('المتصفح لا يدعم تحديد الموقع الجغرافي');
            }
        });
    }
    
    // زر إضافة عقار
    const addPropertyBtn = document.getElementById('add-property-map');
    if (addPropertyBtn) {
        addPropertyBtn.addEventListener('click', function() {
            openAddPropertyModal();
        });
    }
    
    // تطبيق الفلاتر
    const applyFiltersBtn = document.getElementById('apply-filters');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', applyFilters);
    }
    
    // إعادة تعيين الفلاتر
    const resetFiltersBtn = document.getElementById('reset-filters');
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', resetFilters);
    }
}

// إعداد أحداث الخريطة
function setupMapEvents() {
    // إغلاق النوافذ عند النقر على الخريطة
    map.on('click', function() {
        closePropertyPopup();
    });
}

// تطبيق الفلاتر
function applyFilters() {
    const city = document.getElementById('city-select').value;
    const type = Array.from(document.querySelectorAll('.property-type-filters input:checked'))
                     .map(input => input.nextSibling.textContent.trim());
    const price = document.getElementById('price-slider').value;
    
    let filteredProperties = properties;
    
    if (city) {
        filteredProperties = filteredProperties.filter(p => 
            p.address.includes(city === 'riyadh' ? 'الرياض' : 
                              city === 'jeddah' ? 'جدة' : 'الدمام')
        );
    }
    
    if (type.length > 0) {
        filteredProperties = filteredProperties.filter(p => 
            type.some(t => {
                switch(t) {
                    case 'شقة': return p.type === 'apartment';
                    case 'فيلا': return p.type === 'villa';
                    case 'أرض': return p.type === 'land';
                    case 'عمارة': return p.type === 'building';
                    default: return true;
                }
            })
        );
    }
    
    if (price < 10000000) {
        const priceNum = parseInt(price);
        filteredProperties = filteredProperties.filter(p => {
            const propertyPrice = parseInt(p.price.replace(/[^0-9]/g, ''));
            return propertyPrice <= priceNum;
        });
    }
    
    // إخفاء العلامات القديمة
    propertyMarkers.forEach(marker => {
        map.removeLayer(marker);
    });
    
    // إضافة العلامات المصفاة
    propertyMarkers = [];
    filteredProperties.forEach(property => {
        if (property.marker) {
            map.addLayer(property.marker);
            propertyMarkers.push(property.marker);
        }
    });
    
    // تحديث القائمة
    updateFilteredPropertiesList(filteredProperties);
    
    // تحديث عدد النتائج
    updateResultsCount(filteredProperties.length);
}

// إعادة تعيين الفلاتر
function resetFilters() {
    document.getElementById('country-select').value = '';
    document.getElementById('city-select').value = '';
    document.getElementById('district-select').value = '';
    
    document.querySelectorAll('.property-type-filters input').forEach(input => {
        input.checked = false;
    });
    
    document.getElementById('price-slider').value = 5000000;
    document.getElementById('current-price').textContent = '5,000,000';
    
    document.querySelectorAll('.room-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector('.room-btn').classList.add('active');
    
    // إعادة عرض جميع العقارات
    propertyMarkers.forEach(marker => {
        map.addLayer(marker);
    });
    
    updatePropertiesList();
    updateResultsCount(properties.length);
}

// تحديث قائمة العقارات المصفاة
function updateFilteredPropertiesList(filteredProperties) {
    const propertiesList = document.querySelector('.properties-list');
    if (!propertiesList) return;
    
    propertiesList.innerHTML = '';
    
    filteredProperties.forEach(property => {
        const propertyCard = createPropertyCard(property);
        propertiesList.appendChild(propertyCard);
    });
}

// تحديث عدد النتائج
function updateResultsCount(count) {
    const resultsCount = document.querySelector('.results-count');
    if (resultsCount) {
        resultsCount.textContent = `${count} عقاراً`;
    }
}

// فتح نافذة إضافة عقار
function openAddPropertyModal() {
    const center = map.getCenter();
    
    const modalHtml = `
        <div class="modal-overlay" id="add-property-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-plus-circle"></i> إضافة عقار جديد</h3>
                    <button class="close-modal">×</button>
                </div>
                <div class="modal-body">
                    <form id="add-property-form">
                        <div class="form-group">
                            <label><i class="fas fa-home"></i> نوع العقار</label>
                            <select id="property-type" required>
                                <option value="">اختر نوع العقار</option>
                                <option value="apartment">شقة</option>
                                <option value="villa">فيلا</option>
                                <option value="land">أرض</option>
                                <option value="building">عمارة</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label><i class="fas fa-tag"></i> عنوان العقار</label>
                            <input type="text" id="property-title" placeholder="أدخل عنوان العقار" required>
                        </div>
                        
                        <div class="form-group">
                            <label><i class="fas fa-money-bill-wave"></i> السعر (ريال)</label>
                            <input type="number" id="property-price" placeholder="أدخل سعر العقار" required>
                        </div>
                        
                        <div class="form-group">
                            <label><i class="fas fa-map-marker-alt"></i> الموقع</label>
                            <div class="location-info">
                                <p>خط العرض: <span id="property-lat">${center.lat.toFixed(6)}</span></p>
                                <p>خط الطول: <span id="property-lng">${center.lng.toFixed(6)}</span></p>
                                <p class="location-hint">اسحب العلامة على الخريطة لتحديد الموقع الدقيق</p>
                            </div>
                        </div>
                        
                        <div class="modal-actions">
                            <button type="button" class="btn btn-outline close-modal">إلغاء</button>
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-paper-plane"></i> إرسال للإدارة
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHtml;
    document.body.appendChild(modalContainer);
    
    // إضافة علامة قابلة للسحب
    addDraggableMarker(center);
    
    // إعداد النموذج
    const form = document.getElementById('add-property-form');
    if (form) {
        form.addEventListener('submit', handleAddPropertyForm);
    }
    
    // إضافة أحداث الإغلاق للأزرار
    const closeButtons = modalContainer.querySelectorAll('.close-modal');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            closeAddPropertyModal();
        });
    });
    
    // إغلاق النافذة عند النقر خارجها
    modalContainer.querySelector('.modal-overlay').addEventListener('click', function(e) {
        if (e.target === this) {
            closeAddPropertyModal();
        }
    });
}

// إضافة علامة قابلة للسحب
function addDraggableMarker(position) {
    // إزالة أي علامة سابقة
    if (window.draggableMarker) {
        map.removeLayer(window.draggableMarker);
    }
    
    const draggableIcon = L.divIcon({
        className: 'draggable-property-marker',
        html: `
            <div class="draggable-property">
                <div class="draggable-body">
                    <i class="fas fa-home"></i>
                </div>
                <div class="draggable-tail"></div>
                <div class="draggable-pulse"></div>
            </div>
        `,
        iconSize: [50, 60],
        iconAnchor: [25, 55]
    });
    
    window.draggableMarker = L.marker(position, {
        draggable: true,
        icon: draggableIcon
    }).addTo(map);
    
    window.draggableMarker.on('dragend', function() {
        const newPosition = this.getLatLng();
        updatePropertyCoordinates(newPosition.lat, newPosition.lng);
    });
    
    map.setView(position, 15);
}

// تحديث إحداثيات العقار
function updatePropertyCoordinates(lat, lng) {
    const latElement = document.getElementById('property-lat');
    const lngElement = document.getElementById('property-lng');
    
    if (latElement) latElement.textContent = lat.toFixed(6);
    if (lngElement) lngElement.textContent = lng.toFixed(6);
}

// معالجة نموذج إضافة العقار
function handleAddPropertyForm(e) {
    e.preventDefault();
    
    const propertyData = {
        type: document.getElementById('property-type').value,
        title: document.getElementById('property-title').value,
        price: document.getElementById('property-price').value,
        lat: parseFloat(document.getElementById('property-lat').textContent),
        lng: parseFloat(document.getElementById('property-lng').textContent),
        status: 'pending'
    };
    
    if (!propertyData.type || !propertyData.title || !propertyData.price) {
        alert('الرجاء ملء جميع الحقول الإلزامية');
        return;
    }
    
    console.log('بيانات العقار المرسلة:', propertyData);
    alert('تم إرسال طلب إضافة العقار بنجاح! سيتم مراجعته من قبل الإدارة.');
    
    closeAddPropertyModal();
}

// إغلاق نافذة إضافة عقار
function closeAddPropertyModal() {
    const modal = document.getElementById('add-property-modal');
    if (modal) {
        modal.remove();
    }
    
    if (window.draggableMarker) {
        map.removeLayer(window.draggableMarker);
        window.draggableMarker = null;
    }
}

// فتح تفاصيل العقار
function openPropertyDetails(propertyId) {
    window.location.href = `property.html?id=${propertyId}`;
}

// تهيئة الخريطة عند تحميل الصفحة
if (document.getElementById('map')) {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(initMap, 500);
    });
}