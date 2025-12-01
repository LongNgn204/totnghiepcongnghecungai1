import React from 'react';
import { FileText, CheckCircle, AlertTriangle } from 'lucide-react';

const TermsOfService: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gray-900 px-8 py-10 text-white">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
                            <FileText className="w-8 h-8" />
                        </div>
                        <h1 className="text-3xl font-bold">Điều Khoản Sử Dụng</h1>
                    </div>
                    <p className="text-gray-400 text-lg">
                        Quy định về việc sử dụng nền tảng STEM Vietnam.
                    </p>
                </div>

                <div className="p-8 space-y-8">
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            1. Chấp nhận điều khoản
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            Bằng việc truy cập và sử dụng website này, bạn đồng ý tuân thủ các điều khoản và điều kiện được quy định tại đây. Nếu không đồng ý, vui lòng ngừng sử dụng dịch vụ.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">2. Quyền sở hữu trí tuệ</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Toàn bộ nội dung, bao gồm nhưng không giới hạn ở văn bản, hình ảnh, mã nguồn, và dữ liệu đề thi đều thuộc quyền sở hữu của chúng tôi hoặc được cấp phép sử dụng hợp pháp. Nghiêm cấm sao chép dưới mọi hình thức khi chưa có sự đồng ý.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-orange-500" />
                            3. Trách nhiệm người dùng
                        </h2>
                        <ul className="list-disc list-inside mt-2 text-gray-600 ml-4 space-y-2">
                            <li>Sử dụng dịch vụ cho mục đích học tập lành mạnh.</li>
                            <li>Không thực hiện các hành vi phá hoại, tấn công hệ thống.</li>
                            <li>Tự chịu trách nhiệm bảo mật tài khoản của mình.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">4. Miễn trừ trách nhiệm</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Mặc dù chúng tôi nỗ lực đảm bảo tính chính xác của nội dung (được hỗ trợ bởi AI), chúng tôi không chịu trách nhiệm cho bất kỳ sai sót nào có thể xảy ra. Người dùng nên đối chiếu với Sách Giáo Khoa chính thức.
                        </p>
                    </section>

                    <div className="pt-8 border-t border-gray-100 text-sm text-gray-500">
                        Cập nhật lần cuối: 23/11/2025
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
