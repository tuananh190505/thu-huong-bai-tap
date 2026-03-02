// Sample data script
// Thêm vào console hoặc gọi hàm này để load sample data

function loadSampleData() {
    const sampleQuestions = [
        {
            id: 1,
            text: "Năm nay là năm con gì?",
            options: ["Con Rồng", "Con Rắn", "Con Ngựa", "Con Dê"],
            correctAnswer: 1,
            congratsMessage: "🎆 Chúc bạn năm mới an khang thịnh vượng! Sức khỏe dồi dào, hạnh phúc viên mãn!"
        },
        {
            id: 2,
            text: "Nguyên đán Tết được gọi là gì?",
            options: ["Tết Nguyên đán", "Tết Chính nguyệt", "Tết Mùng 1", "Tết Lì xì"],
            correctAnswer: 2,
            congratsMessage: "✨ Tết vui vẻ! May mắn tìm đến bạn!"
        },
        {
            id: 3,
            text: "Lì xì được tặng vào ngày nào?",
            options: ["Mùng 1 Tết", "Mùng 2 Tết", "Cả ngày Tết", "Mùng 5 Tết"],
            correctAnswer: 3,
            congratsMessage: "🧧 Lì xì trao tay, lộc tới nhà! Tiền vào, vui ra!"
        },
        {
            id: 4,
            text: "Mâm cúng Tết thường có bao nhiêu thứ?",
            options: ["3 thứ", "5 thứ", "7 thứ", "9 thứ"],
            correctAnswer: 2,
            congratsMessage: "🙏 Bác bảo vệ gia đình, ban phúc lộc!"
        },
        {
            id: 5,
            text: "Hoa nào là biểu tượng của Tết?",
            options: ["Hoa Anh đào", "Hoa Đào & Lê", "Hoa Hồng", "Hoa Cẩm chướng"],
            correctAnswer: 2,
            congratsMessage: "🌸 Cây đào nở hoa, may mắn tới nhà! Hoa lê trắng, nước mắt vui!"
        },
        {
            id: 6,
            text: "Tục ngón chỉ mồm người khác vào Tết gọi là?",
            options: ["Xé tết", "Phá tết", "Hỏng tết", "Đánh tết"],
            correctAnswer: 3,
            congratsMessage: "🎯 Nắm rõ tục lệ, sống tốt đẹp! Tôn trọng truyền thống, yêu mến gia đình!"
        }
    ];

    // Clear existing data
    localStorage.removeItem('luckydraw_questions');
    localStorage.removeItem('luckydraw_gamestate');

    // Add sample questions
    sampleQuestions.forEach(q => {
        DataManager.addQuestion({
            text: q.text,
            options: q.options,
            correctAnswer: q.correctAnswer,
            congratsMessage: q.congratsMessage
        });
    });

    console.log('✅ Sample data loaded! Reload the page to see the questions.');
    alert('✅ Đã thêm 6 câu hỏi mẫu! Vui lòng reload trang để xem!');
}

// Load sample data automatically on first visit
document.addEventListener('DOMContentLoaded', () => {
    const hasData = localStorage.getItem('luckydraw_questions');
    if (!hasData) {
        // Uncomment line below to load sample data automatically
        // loadSampleData();
    }
});
