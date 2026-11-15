// База данных аудиторий и маршрутов от маркеров (Hiro и Kanji)
const NAVIGATION_GRAPH = {
    '902': {
        title: 'Ауд. 902',
        description: 'Учебная аудитория №902. 9 этаж, правое крыло.',
        routes: {
            hiro: { angle: 0, text: 'От маркера Hiro идите прямо по коридору 15 метров.' },
            kanji: { angle: 90, text: 'Вы у цели! Аудитория 902 находится справа от вас.' }
        }
    },
    '903': {
        title: 'Ауд. 903',
        description: 'Компьютерный класс №903. 9 этаж, в конце коридора.',
        routes: {
            hiro: { angle: -90, text: 'От маркера Hiro поверните налево к маркеру Kanji.' },
            kanji: { angle: 0, text: 'От маркера Kanji пройдите прямо 5 метров до Ауд. 903.' }
        }
    },
    'exit': {
        title: 'Выход / Лифт',
        description: 'Лифтовой холл и эвакуационная лестница.',
        routes: {
            hiro: { angle: 180, text: 'Развернитесь — лифтовой холл прямо за вашей спиной.' },
            kanji: { angle: -90, text: 'Поверните налево и идите до маркера Hiro у лифта.' }
        }
    }
};

let currentTarget = '902';
let lastInstruction = 'Наведите камеру на маркер Hiro или Kanji';

function speak(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ru-RU';
        window.speechSynthesis.speak(utterance);
    }
}

function updateNavigationUI() {
    const targetData = NAVIGATION_GRAPH[currentTarget];
    document.getElementById('target-badge').textContent = `📍 ${targetData.title}`;
    document.getElementById('modal-title').textContent = targetData.title;
    document.getElementById('modal-desc').textContent = targetData.description;

    // Поворачиваем 3D-стрелки на маркерах под выбранный маршрут
    const arrowHiro = document.getElementById('arrow-hiro');
    const arrowKanji = document.getElementById('arrow-kanji');
    if (arrowHiro) arrowHiro.setAttribute('rotation', `0 ${targetData.routes.hiro.angle} 0`);
    if (arrowKanji) arrowKanji.setAttribute('rotation', `0 ${targetData.routes.kanji.angle} 0`);
}

window.addEventListener('DOMContentLoaded', () => {
    const select = document.getElementById('destination-select');
    const toast = document.getElementById('instruction-toast');
    const modal = document.getElementById('info-modal');

    select.addEventListener('change', (e) => {
        currentTarget = e.target.value;
        updateNavigationUI();
        lastInstruction = `Маршрут перестроен: ${NAVIGATION_GRAPH[currentTarget].title}. Наведите на маркер.`;
        toast.textContent = lastInstruction;
    });

    // События обнаружения маркеров камерой
    document.getElementById('marker-hiro').addEventListener('markerFound', () => {
        lastInstruction = NAVIGATION_GRAPH[currentTarget].routes.hiro.text;
        toast.textContent = lastInstruction;
        speak(lastInstruction);
    });

    document.getElementById('marker-kanji').addEventListener('markerFound', () => {
        lastInstruction = NAVIGATION_GRAPH[currentTarget].routes.kanji.text;
        toast.textContent = lastInstruction;
        speak(lastInstruction);
    });

    // Кнопки нижней панели
    document.getElementById('voice-btn').addEventListener('click', () => speak(lastInstruction));
    document.getElementById('info-btn').addEventListener('click', () => modal.classList.remove('hidden'));
    document.getElementById('close-modal-btn').addEventListener('click', () => modal.classList.add('hidden'));

    updateNavigationUI();
});
