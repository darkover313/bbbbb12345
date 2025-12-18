// إدارة نموذج إضافة العقار متعدد الخطوات

let currentStep = 1;
const totalSteps = 3;

// الانتقال للخطوة التالية
function nextStep() {
    if (!validateStep(currentStep)) {
        return;
    }
    
    if (currentStep < totalSteps) {
        // إخفاء الخطوة الحالية
        document.getElementById(`step-${currentStep}`).classList.remove('active');
        document.querySelectorAll('.stepper .step')[currentStep - 1].classList.remove('active');
        
        // إظهار الخطوة التالية
        currentStep++;
        document.getElementById(`step-${currentStep}`).classList.add('active');
        document.querySelectorAll('.stepper .step')[currentStep - 1].classList.add('active');
        
        // إذا كانت الخطوة 2، تهيئة الخريطة المصغرة
        if (currentStep === 2) {
            initMiniMap();
        }
    }
}

// الانتقال للخطوة السابقة
function prevStep() {
    if (currentStep > 1) {
        // إخفاء الخطوة الحالية
        document.getElementById(`step-${currentStep}`).classList.remove('active');
        document.querySelectorAll('.stepper .step')[currentStep - 1].classList.remove('active');
        
        // إظهار الخطوة السابقة
        currentStep--;
        document.getElementById(`step-${currentStep}`).classList.add('active');
        document.querySelectorAll('.stepper .step')[currentStep - 1].classList.add('active');
    }
}

// التحقق من صحة البيانات في الخطوة الحالية
function validateStep(step) {
    switch(step) {
        case 1:
            const type = document.getElementById('property-type-full').value;
            const title = document.getElementById('property-title-full').value;
            const price = document.getElementById('property-price-full').value;
            const area = document.getElementById('property-area-full').value;
            const description = document.getElementById('property-description-full').value;
            
            if (!type || !title || !price || !area || !description) {
                alert('الرجاء ملء جميع الحقول الإلزامية في هذه الخطوة');
                return false;
            }
            
            if (price <= 0) {
                alert('الرجاء إدخال سعر صحيح للعقار');
                return false;
            }
            
            if (area <= 0) {
                alert('الرجاء إدخال مساحة صحيحة للعقار');
                return false;
            }
            
            return true;
            
        case 2:
            const country = document.getElementById('property-country').value;
            const city = document.getElementById('property-city').value;
            const district = document.getElementById('property-district').value;
            
            if (!country || !city || !district) {
                alert('الرجاء تحديد الدولة والمدينة والحي');
                return false;
            }
            
            return true;
            
        default:
            return true;
    }
}

// تهيئة الخريطة المصغرة
function initMiniMap() {
    const mapContainer = document.getElementById('mini-map');
    if (!mapContainer) return;
    
    // تنظيف الخريطة السابقة
    mapContainer.innerHTML = '';
    
    // إحداثيات افتراضية (الرياض)
    const defaultLat = 24.7136;
    const defaultLng = 46.6753;
    
    // إنشاء الخريطة
    const map = L.map('mini-map').setView([defaultLat, defaultLng], 13);
    
    // إضافة طبقة الخريطة
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
    }).addTo(map);
    
    // إنشاء أيقونة خاصة
    const propertyIcon = L.divIcon({
        className: 'property-location-marker',
        html: `
            <div class="property-location">
                <i class="fas fa-home"></i>
            </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 40]
    });
    
    // إضافة علامة قابلة للسحب
    const marker = L.marker([defaultLat, defaultLng], {
        draggable: true,
        icon: propertyIcon
    }).addTo(map);
    
    // عند سحب العلامة، تحديث الإحداثيات
    marker.on('dragend', function() {
        const position = this.getLatLng();
        updateCoordinates(position.lat, position.lng);
    });
    
    // تحديث الإحداثيات في البداية
    updateCoordinates(defaultLat, defaultLng);
    
    // حفظ المرجع للخريطة
    window.miniMap = map;
    window.propertyMarker = marker;
}

// تحديث الإحداثيات في النموذج
function updateCoordinates(lat, lng) {
    const latElement = document.getElementById('property-lat-full');
    const lngElement = document.getElementById('property-lng-full');
    
    if (latElement) latElement.textContent = lat.toFixed(6);
    if (lngElement) lngElement.textContent = lng.toFixed(6);
}

// إعداد رفع الصور
document.addEventListener('DOMContentLoaded', function() {
    // عند اختيار المدينة، تحديث المناطق المتاحة
    const citySelect = document.getElementById('property-city');
    if (citySelect) {
        citySelect.addEventListener('change', function() {
            updateDistricts(this.value);
        });
    }
    
    // إعداد رفع الصور
    const imageInput = document.getElementById('property-images-full');
    const previewGrid = document.getElementById('image-preview-full');
    const uploadArea = document.getElementById('image-upload-area');
    
    if (imageInput && previewGrid && uploadArea) {
        // رفع بالـ drag & drop
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, preventDefaults, false);
        });
        
        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, highlight, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, unhighlight, false);
        });
        
        function highlight() {
            uploadArea.classList.add('highlight');
        }
        
        function unhighlight() {
            uploadArea.classList.remove('highlight');
        }
        
        // معالجة الملفات المنسدلة
        uploadArea.addEventListener('drop', handleDrop, false);
        
        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            handleFiles(files);
        }
        
        // معالجة الملفات المختارة
        imageInput.addEventListener('change', function() {
            handleFiles(this.files);
        });
    }
    
    // معالجة نموذج الإرسال
    const form = document.getElementById('add-property-form-full');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
});

// تحديث المناطق بناءً على المدينة
function updateDistricts(city) {
    const districtInput = document.getElementById('property-district');
    if (!districtInput) return;
    
    // قائمة المناطق حسب المدينة
    const districts = {
        'riyadh': ['النخيل', 'العليا', 'الملك فهد', 'الملز', 'العريجاء', 'الشميسي', 'النسيم'],
        'jeddah': ['الصفا', 'المحمدية', 'الروضة', 'الشاطئ', 'النسيم', 'الزهراء'],
        'dammam': ['الخليج', 'الدانة', 'الفناتير', 'المنطقة الصناعية'],
        'khobar': ['الغرابي', 'الراكة', 'الحزام الذهبي', 'الروضة'],
        'makkah': ['العزيزية', 'الشبيكة', 'الجموم', 'الزاهر']
    };
    
    // إذا كانت المدينة موجودة، إضافة اقتراحات
    if (districts[city]) {
        // يمكن إضافة datalist هنا للاقتراحات
        console.log('المناطق المتاحة:', districts[city]);
    }
}

// معالجة الملفات المرفوعة
function handleFiles(files) {
    const previewGrid = document.getElementById('image-preview-full');
    if (!previewGrid) return;
    
    // الحد الأقصى للصور
    const maxImages = 10;
    const existingImages = previewGrid.querySelectorAll('.preview-image').length;
    const availableSlots = maxImages - existingImages;
    
    const filesToAdd = Array.from(files).slice(0, availableSlots);
    
    if (files.length > availableSlots) {
        alert(`يمكنك رفع ${availableSlots} صور فقط (الحد الأقصى 10 صور)`);
    }
    
    filesToAdd.forEach((file, index) => {
        // التحقق من حجم الملف (5MB كحد أقصى)
        if (file.size > 5 * 1024 * 1024) {
            alert(`الصورة ${file.name} حجمها كبير جداً (الحد الأقصى 5MB)`);
            return;
        }
        
        // التحقق من نوع الملف
        if (!file.type.match('image.*')) {
            alert(`الملف ${file.name} ليس صورة`);
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const imgContainer = document.createElement('div');
            imgContainer.className = 'preview-image';
            imgContainer.innerHTML = `
                <img src="${e.target.result}" alt="معاينة">
                <button type="button" class="remove-image" onclick="removeImageFull(this)">
                    <i class="fas fa-times"></i>
                </button>
            `;
            previewGrid.appendChild(imgContainer);
        };
        
        reader.readAsDataURL(file);
    });
}

// حذف صورة من المعاينة
function removeImageFull(btn) {
    const imgContainer = btn.closest('.preview-image');
    if (imgContainer) {
        imgContainer.remove();
    }
}

// معالجة إرسال النموذج
function handleFormSubmit(e) {
    e.preventDefault();
    
    // التحقق من الموافقة على الشروط
    const agreeTerms = document.getElementById('agree-terms');
    if (!agreeTerms.checked) {
        alert('يجب الموافقة على الشروط والأحكام');
        return;
    }
    
    // جمع البيانات من النموذج
    const propertyData = {
        // المعلومات الأساسية
        type: document.getElementById('property-type-full').value,
        status: document.getElementById('property-status').value,
        title: document.getElementById('property-title-full').value,
        price: document.getElementById('property-price-full').value,
        area: document.getElementById('property-area-full').value,
        rooms: document.getElementById('property-rooms-full').value,
        baths: document.getElementById('property-baths-full').value,
        description: document.getElementById('property-description-full').value,
        
        // الموقع
        country: document.getElementById('property-country').value,
        city: document.getElementById('property-city').value,
        district: document.getElementById('property-district').value,
        street: document.getElementById('property-street').value,
        building: document.getElementById('property-building').value,
        lat: parseFloat(document.getElementById('property-lat-full').textContent),
        lng: parseFloat(document.getElementById('property-lng-full').textContent),
        
        // المستندات (في التطبيق الحقيقي، هنا سيتم رفع الملفات)
        documents: {
            deed: 'pending',
            id: 'pending'
        },
        
        // حالة العقار
        listingStatus: 'pending',
        date: new Date().toISOString(),
        user: 'current-user-id' // سيتم استبداله بمعرف المستخدم الحقيقي
    };
    
    // التحقق النهائي من البيانات
    if (!validatePropertyData(propertyData)) {
        return;
    }
    
    // إظهار مؤتمر التحميل
    showLoading();
    
    // محاكاة إرسال البيانات إلى السيرفر
    setTimeout(() => {
        // إخفاء مؤشر التحميل
        hideLoading();
        
        // إظهار رسالة النجاح
        showSuccessMessage();
        
        // في التطبيق الحقيقي، هنا سيتم:
        // 1. رفع الصور والمستندات إلى السيرفر
        // 2. إرسال البيانات إلى قاعدة البيانات
        // 3. إرسال إشعار للإدارة
        // 4. إرسال إيميل تأكيد للمستخدم
        
        console.log('تم إرسال بيانات العقار:', propertyData);
        
        // إعادة تعيين النموذج (اختياري)
        // document.getElementById('add-property-form-full').reset();
        
    }, 2000);
}

// التحقق من بيانات العقار
function validatePropertyData(data) {
    if (!data.type || !data.title || !data.price || !data.area || !data.description) {
        alert('الرجاء ملء جميع الحقول الإلزامية');
        return false;
    }
    
    if (data.price <= 0) {
        alert('الرجاء إدخال سعر صحيح للعقار');
        return false;
    }
    
    if (data.area <= 0) {
        alert('الرجاء إدخال مساحة صحيحة للعقار');
        return false;
    }
    
    if (!data.country || !data.city || !data.district) {
        alert('الرجاء تحديد الموقع بشكل كامل');
        return false;
    }
    
    return true;
}

// إظهار مؤشر التحميل
function showLoading() {
    const submitBtn = document.querySelector('#step-3 .btn-primary');
    if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
        submitBtn.disabled = true;
    }
}

// إخفاء مؤشر التحميل
function hideLoading() {
    const submitBtn = document.querySelector('#step-3 .btn-primary');
    if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> إرسال للإدارة';
        submitBtn.disabled = false;
    }
}

// إظهار رسالة النجاح
function showSuccessMessage() {
    // إخفاء الخطوة 3
    document.getElementById('step-3').classList.remove('active');
    
    // إظهار رسالة النجاح
    const successMessage = document.getElementById('success-message');
    if (successMessage) {
        successMessage.style.display = 'block';
        
        // إضافة تأثير ظهور
        setTimeout(() => {
            successMessage.style.opacity = '1';
            successMessage.style.transform = 'translateY(0)';
        }, 100);
    }
}