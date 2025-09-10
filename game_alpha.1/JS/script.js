document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.link');

    links.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const page = link.getAttribute('data-page');
            // 跳转到对应的页面
            window.location.href = page;
        });
    });
});
