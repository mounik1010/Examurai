import java.util.Scanner;

public class Main {
    static Scanner scan = new Scanner(System.in);

    public static void main(String[] args) {
        int x = scan.nextInt();
        int y = scan.nextInt();
        int result = sum(x, y);
        System.out.println(result);
    }

    static int sum(int a, int b) {
        return a + b;
    }
}
