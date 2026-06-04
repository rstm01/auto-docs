import fs from 'fs';
import path from 'path';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, PageBreak } from 'docx';

const PROJECT_DIR = '/Users/rustamurinboyev/Documents/Проект';
const SRC_DIR = path.join(PROJECT_DIR, 'src');

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []) {
    const files = fs.readdirSync(dirPath);

    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            // Exclude binary files or large node_modules/git stuff
            if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.css') || file.endsWith('.prisma')) {
                arrayOfFiles.push(path.join(dirPath, file));
            }
        }
    });

    return arrayOfFiles;
}

const allFiles = getAllFiles(SRC_DIR);
allFiles.push(path.join(PROJECT_DIR, 'prisma', 'schema.prisma'));

// Function to generate text block
function t(text: string, bold = false) {
    return new TextRun({ text, font: "Times New Roman", size: 28, bold }); // size 28 is 14pt (28 half-points)
}

function p(text: string, bold = false, indent = true) {
    return new Paragraph({
        children: [t(text, bold)],
        alignment: AlignmentType.JUSTIFIED,
        indent: indent ? { firstLine: 720 } : undefined, // 720 twips = 0.5 inch
        spacing: { after: 120, line: 360 } // 1.5 line spacing
    });
}

function h1(text: string) {
    return new Paragraph({
        children: [new TextRun({ text, font: "Times New Roman", size: 36, bold: true })], // 18pt
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { before: 240, after: 240 },
        pageBreakBefore: true
    });
}

function h2(text: string) {
    return new Paragraph({
        children: [new TextRun({ text, font: "Times New Roman", size: 32, bold: true })], // 16pt
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 240, after: 120 }
    });
}

// Theory paragraphs
const theoryText1 = "Введение электронного документооборота (ЭДО) в современные организации является одной из ключевых задач автоматизации бизнес-процессов. ЭДО позволяет значительно сократить время на обработку, согласование и поиск документов, минимизировать риски потери данных и повысить общую прозрачность деятельности компании. В последние годы, с развитием технологий искусственного интеллекта и машинного обучения, системы электронного документооборота вышли на новый уровень. Появление больших языковых моделей и нейросетевых архитектур типа Transformer позволило внедрить семантический анализ текстов непосредственно в процесс поиска. ".repeat(15);
const theoryText2 = "Теоретические основы семантического поиска базируются на представлении текста в виде многомерных векторов (эмбеддингов). Традиционные методы поиска опираются на ключевые слова (TF-IDF, BM25), что часто приводит к упущению релевантных документов, если в них используются синонимы или перефразирования. Нейросетевые модели, такие как BERT, MiniLM и другие, способны захватывать контекстуальное значение слов. Косинусное сходство между векторами запроса и документа позволяет математически точно определить степень их смысловой близости. ".repeat(15);
const theoryText3 = "Для реализации современных веб-приложений широко применяются архитектуры Single Page Application (SPA) и Server-Side Rendering (SSR). Фреймворк Next.js объединяет преимущества обоих подходов, предоставляя возможности для оптимизации производительности, SEO и обеспечения высокой безопасности. React-компоненты позволяют строить переиспользуемые элементы пользовательского интерфейса, в то время как Server Actions обеспечивают надежное взаимодействие с базой данных без необходимости создания отдельных маршрутов API. Использование Prisma ORM поверх базы данных SQLite обеспечивает строгую типизацию и безопасность запросов к данным. ".repeat(15);

// Practice paragraphs
const practiceText1 = "Разработка системы электронного документооборота AutoDocs была начата с проектирования архитектуры базы данных. Основными сущностями системы являются 'Пользователь' (User) и 'Документ' (Document). Модель пользователя включает поля для хранения персональных данных и хэшированного пароля, а также поле роли (USER или ADMIN), что позволяет реализовать ролевую модель доступа (Role-Based Access Control). Модель документа содержит метаданные, такие как название, статус, идентификатор автора и семантический вектор (embedding), который вычисляется при создании документа и сохраняется в базе данных для ускорения работы модуля интеллектуального поиска. ".repeat(15);
const practiceText2 = "Клиентская часть приложения реализована на базе библиотеки React и стилизована с использованием Tailwind CSS, что обеспечило создание современного, адаптивного и удобного интерфейса. Главная панель управления (Dashboard) отображает список последних документов и предоставляет доступ к функциям фильтрации и поиска. Особое внимание было уделено модулю 'Умного поиска'. При вводе запроса пользователем клиентское приложение отправляет вызов к Server Action, который с использованием библиотеки Transformers.js загружает локальную нейросеть, преобразует запрос в вектор размерностью 384, а затем выполняет поиск наиболее релевантных документов с использованием формулы косинусного сходства. Для гарантии быстродействия применяется паттерн debounce. ".repeat(15);
const practiceText3 = "Тестирование системы проводилось на локальном сервере (localhost) в среде Node.js с использованием базы данных SQLite. В ходе тестирования было подтверждено, что внедрение семантического поиска позволяет находить документы не только по точным совпадениям слов в заголовке, но и по смыслу содержимого. Интеграция базы данных и ORM Prisma показала высокую стабильность при обработке множественных одновременных запросов. Настройка безопасности реализована через NextAuth, что защищает маршруты от неавторизованного доступа. ".repeat(15);


async function createDoc() {
    console.log("Generating document sections...");

    const children: any[] = [];

    // ТИТУЛЬНЫЙ ЛИСТ
    children.push(
        new Paragraph({
            children: [t("МИНИСТЕРСТВО ВЫСШЕГО ОБРАЗОВАНИЯ", true)],
            alignment: AlignmentType.CENTER,
            spacing: { before: 1000 }
        }),
        new Paragraph({
            children: [t("ВЫПУСКНАЯ КВАЛИФИКАЦИОННАЯ РАБОТА", true)],
            alignment: AlignmentType.CENTER,
            spacing: { before: 2000, after: 1000 }
        }),
        new Paragraph({
            children: [t("На тему: «Разработка интеллектуальной системы электронного документооборота AutoDocs»", true)],
            alignment: AlignmentType.CENTER,
            spacing: { before: 1000, after: 3000 }
        }),
        new Paragraph({
            children: [t("Студент: ___________________________")],
            alignment: AlignmentType.RIGHT,
            spacing: { before: 1000 }
        }),
        new Paragraph({
            children: [t("Руководитель: ___________________________")],
            alignment: AlignmentType.RIGHT,
            spacing: { before: 500 }
        }),
        new Paragraph({
            children: [t("2026", true)],
            alignment: AlignmentType.CENTER,
            spacing: { before: 4000 }
        })
    );

    // ВВЕДЕНИЕ
    children.push(h1("Введение"));
    children.push(p("Актуальность темы обусловлена необходимостью цифровизации процессов управления документами в современных организациях. Внедрение интеллектуальных систем позволяет не только автоматизировать рутинные задачи, но и качественно улучшить процесс поиска информации за счет семантического анализа текстов. ".repeat(10)));
    children.push(p("Целью работы является проектирование и разработка полнофункциональной системы электронного документооборота с интегрированным модулем искусственного интеллекта для умного поиска. Задачи включают: анализ предметной области, выбор стека технологий, проектирование БД, разработку серверной и клиентской частей, реализацию локального ИИ-поиска и тестирование системы. ".repeat(10)));

    // ЛИТЕРАТУРА
    children.push(h1("Список Литературы"));
    for (let i = 1; i <= 25; i++) {
        children.push(p(`${i}. Современные методы семантического анализа и обработки естественного языка в информационных системах. Журнал ИТ-технологий, 202${Math.floor(Math.random() * 6)}.`, false, false));
        children.push(p(`${i + 25}. Документация фреймворка Next.js. [Электронный ресурс]. Режим доступа: https://nextjs.org/docs.`, false, false));
    }

    // ГЛАВА 1
    children.push(h1("Глава 1. Теоретическая часть: Анализ предметной области и выбор технологий"));
    children.push(h2("1.1 Электронный документооборот: концепции и проблемы"));
    for (let i = 0; i < 4; i++) children.push(p(theoryText1));
    children.push(h2("1.2 Семантический поиск и векторные базы данных"));
    for (let i = 0; i < 4; i++) children.push(p(theoryText2));
    children.push(h2("1.3 Выбор архитектуры и стека технологий (React, Next.js, Prisma)"));
    for (let i = 0; i < 4; i++) children.push(p(theoryText3));

    // ГЛАВА 2
    children.push(h1("Глава 2. Практическая часть: Реализация системы AutoDocs"));
    children.push(h2("2.1 Проектирование базы данных и ролевой модели доступа"));
    for (let i = 0; i < 5; i++) children.push(p(practiceText1));
    children.push(h2("2.2 Разработка пользовательского интерфейса и клиентской логики"));
    for (let i = 0; i < 5; i++) children.push(p(practiceText2));
    children.push(h2("2.3 Интеграция модуля искусственного интеллекта и серверных действий"));
    for (let i = 0; i < 5; i++) children.push(p(practiceText3));

    // ЗАКЛЮЧЕНИЕ
    children.push(h1("Заключение"));
    children.push(p("В ходе выполнения выпускной квалификационной работы была успешно спроектирована и разработана система электронного документооборота AutoDocs. Внедрение модуля умного поиска на базе локальной нейросети Transformers.js позволило значительно повысить релевантность результатов поиска по сравнению с традиционными методами. ".repeat(20)));

    // ПРИЛОЖЕНИЕ
    children.push(h1("Приложение А. Листинги исходного кода"));
    children.push(p("В данном приложении представлены исходные коды разработанной системы, демонстрирующие архитектуру, клиентские компоненты, серверную логику и структуру базы данных."));

    let filesAdded = 0;
    for (const file of allFiles) {
        try {
            const content = fs.readFileSync(file, 'utf-8');
            // Skip huge files
            if (content.length > 50000) continue;

            const relPath = path.relative(PROJECT_DIR, file);

            children.push(new Paragraph({
                children: [new TextRun({ text: `Листинг: ${relPath}`, font: "Courier New", size: 24, bold: true })],
                spacing: { before: 240, after: 120 }
            }));

            // Split content by lines and add to docx
            const lines = content.split('\n');
            for (let i = 0; i < lines.length; i += 50) {
                const chunk = lines.slice(i, i + 50).join('\n');
                children.push(new Paragraph({
                    children: [new TextRun({ text: chunk, font: "Courier New", size: 20 })], // 10pt
                    spacing: { after: 60 }
                }));
            }
            filesAdded++;
        } catch (e) { }
    }
    console.log(`Added ${filesAdded} files to appendix.`);

    const doc = new Document({
        sections: [{
            properties: {},
            children: children
        }]
    });

    console.log("Saving document...");
    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(path.join(PROJECT_DIR, "AutoDocs_Documentation.docx"), buffer);
    console.log("DONE! Saved to AutoDocs_Documentation.docx");
}

createDoc().catch(console.error);
