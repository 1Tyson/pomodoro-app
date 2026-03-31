#include <stdio.h>
#include <windows.h> // Thư viện để dùng hàm Sleep() trên Windows
#include <mmsystem.h> // Thư viện để dùng hàm mciSendString() trên Windows

void countdown(int minutes)
{
    int total_seconds = minutes * 60;

    printf("Bat dau dem nguoc %d phut...\n", minutes);
    while (total_seconds > 0)
    {
        int m = total_seconds / 60;
        int s = total_seconds % 60;

        printf("\rThoi gian con lai %02d:%02d",m,s);
        Sleep(1000);
        total_seconds--;
    }
    printf("\n[HET GIO!]\n");
}
void playmusic(const char* filepath)
{
    char command[512]; // Char Array for storing cmd
    mciSendString("close bgm",NULL,0,NULL);
    sprintf(command, "open \"%s\" alias bgm", filepath);
    mciSendString(command, NULL, 0, NULL);
    mciSendString("play bgm repeat", NULL, 0, NULL);
}
void stop_music()
{
    mciSendString("stop bgm", NULL, 0, NULL);
    mciSendString("close bgm", NULL, 0, NULL);
}


int main(void)
{
    // Đổi chữ trên thanh tiêu đề của cửa sổ đen Terminal cho ngầu
    SetConsoleTitle("Ung Dung Pomodoro - Tap Trung Toi Da");
    // Khai báo 2 biến để lưu thời gian làm và nghỉ
    int work_minutes = 0;
    int break_minutes = 0;
    printf("=== CHAO MUNG DEN VOI POMODORO TIMER ===\n\n");
    
    // Yêu cầu người dùng tự nhập thời gian (số nguyên)
    printf("Nhap so phut lam viec: ");
    scanf("%d", &work_minutes);
    
    printf("Nhap so phut nghi ngoi: ");
    scanf("%d", &break_minutes);
    // Vòng lặp while(1) nghĩa là lặp lại mãi mãi (đến khi bạn bấm X tắt cửa sổ)
    while (1) {
        // --- Giai đoạn 1: LÀM VIỆC ---
        printf("\n========================================\n");
        printf(">> BAT DAU PHIEN LAM VIEC (%d phut)\n", work_minutes);
        
        playmusic("sound.mp3"); // Nhớ giữ nguyên tên file đúng của bạn nhé
        countdown(work_minutes); 
        stop_music();
        
        // Hiện bảng nhắc nhở nghỉ giải lao
        MessageBox(NULL, "Da het gio lam viec, ban hay dung len vuon vai uong nuoc nhe!", "Thong bao Pomodoro", MB_OK | MB_ICONINFORMATION);
        // --- Giai đoạn 2: NGHỈ NGƠI ---
        printf("\n========================================\n");
        printf(">> BAT DAU PHIEN NGHI NGOI (%d phut)\n", break_minutes);
        
        countdown(break_minutes); // Nghỉ thì không bật nhạc
        
        // Hiện bảng nhắc nhở quay lại học/code
        MessageBox(NULL, "Da het gio nghi ngơi! Thang lung len quay lai chien dau thoi.", "Thong bao Pomodoro", MB_OK | MB_ICONEXCLAMATION);
    }
    return 0;
}