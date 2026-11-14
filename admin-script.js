document.addEventListener('DOMContentLoaded', () => {
    const defaultServices = [
        "./adel-grober-wOrA2uWstYg-unsplash.jpg",
        "./fast-incorporated-0OOaj5fsE-s-unsplash.jpg",
        "./fernanda-nuso-amr8fdAVhtg-unsplash.jpg",
        "./gylain-omer-HvYE_AeaytE-unsplash.jpg",
        "./lisa-marie-theck-pYbL3vd9CQI-unsplash.jpg",
        "./lola-azizada-I3y-aJ4DWng-unsplash.jpg"
    ];

    let siteData = JSON.parse(localStorage.getItem('nexus_site_data')) || {};
    if (!Array.isArray(siteData.services)) {
        siteData.services = [...defaultServices];
    }

    function showStatus(msg) {
        const alert = document.getElementById('statusAlert');
        alert.textContent = msg;
        alert.classList.remove('d-none');
        setTimeout(() => alert.classList.add('d-none'), 3000);
    }

    function fileToBase64(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(file);
        });
    }

    function renderServicesForm() {
        const container = document.getElementById('servicesEditorContainer');

        if (siteData.services.length === 0) {
            container.innerHTML = '<p class="text-muted text-center py-4">No service images added yet. Click "Add New Image Box" above.</p>';
            return;
        }

        container.innerHTML = siteData.services.map((url, index) => `
            <div class="image-box-card">
                <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="fw-bold small text-secondary">Service Box #${index + 1}</span>
                <button type="button" class="btn btn-sm btn-outline-danger remove-btn" data-index="${index}">
                    <i class="bi bi-trash me-1"></i>Remove
                </button>
                </div>
                <div class="input-group mb-2">
                <input type="text" class="form-control url-input" data-index="${index}" value="${url}" placeholder="Paste image URL here..." />
                <label class="btn btn-outline-secondary">
                    Upload <input type="file" accept="image/*" hidden class="file-input" data-index="${index}" />
                </label>
                </div>
                <img src="${url}" class="thumb-square" id="thumb_${index}" alt="Preview ${index + 1}" />
            </div>
        `).join('');

        container.querySelectorAll('.url-input').forEach(input => {
            input.addEventListener('input', (e) => {
                const idx = e.target.dataset.index;
                siteData.services[idx] = e.target.value;
                document.getElementById(`thumb_${idx}`).src = e.target.value;
            });
        });

        container.querySelectorAll('.file-input').forEach(input => {
            input.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (file) {
                    const base64 = await fileToBase64(file);
                    const idx = e.target.dataset.index;
                    siteData.services[idx] = base64;
                    container.querySelector(`.url-input[data-index="${idx}"]`).value = base64;
                    document.getElementById(`thumb_${idx}`).src = base64;
                }
            });
        });

        container.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.currentTarget.dataset.index;
                siteData.services.splice(idx, 1);
                renderServicesForm();
            });
        });
    }

    document.getElementById('addServiceBtn').addEventListener('click', () => {
        siteData.services.push("https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80");
        renderServicesForm();
    });

    document.getElementById('saveBtn').addEventListener('click', () => {
        localStorage.setItem('nexus_site_data', JSON.stringify(siteData));
        showStatus("Services images updated successfully! Refresh your index.html page to see changes.");
    });

    renderServicesForm();
});